import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { options } from "../utils/options.js";
import generateRandomString from "../utils/randomStringGenerator.js";

const generateAccessToken = async(userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        
        await user.save({ validateBeforeSave : false });

        return accessToken;

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating refresh and access token.")
    }
}

const registerUser = asyncHandler(async(req, res)=>{

    const {fullName , email  , password } = req.body;
    const userSecret = generateRandomString(8);
    if(
        [fullName , email  , password , userSecret].some((field)=>{
            field ?.trim() === ""
        })
    ){
        throw new ApiError(400 , "All fields are required" )
    }

    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new ApiError(409 , "user with email or username already exists")
    }
    const user = await User.create({
        fullName, 
        email,
        password,
        userSecret
    })

    const createdUser = await User.findById(user._id).select(
        "-password -userSecret"
    )

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user")
    }
    const accessToken = await generateAccessToken(createdUser._id)
    return res.status(201).json(
        new ApiResponse(200 , {user : createdUser , accessToken} , "User registered successfully")
    );

});

const loginUser = asyncHandler(async(req , res)=>{

    const {email  ,password} = req.body;
    if(!email){
        throw new ApiError(400 , "email is required");
    }

    const user = await User.findOne({email, password});
    if(!user){
        throw new ApiError(404 , "user does not exist.")
    }

    const accessToken = await generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");


    // using this cookies can only be modified on server
    
    return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser , 
                accessToken
            }, 
            "user logged in successfully"
        )
    )

});


const changeCurrentPassword = asyncHandler(async(req , res) =>{
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400 , "Invalid old password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave : false});

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "Password changes successfully."))

});

const getCurrentUser = asyncHandler(async(req , res) =>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {user : req.user},
        "fetched current user successfully"
    ))
});

const updateAccountDetails = asyncHandler(async(req, res) =>{
    // in case updating any files create a separate controller (better approach)
    const {fullName ,email} = req.body;

    if(!fullName || !email){
        throw new ApiError(400 ,"All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName,
                email
            }
        },
        {new : true} // new : true returns the user object afte update
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200 , user , "Account details updated successfully."))
});


export { 
    registerUser,
    loginUser,
    changeCurrentPassword ,
    getCurrentUser,
    updateAccountDetails
}


