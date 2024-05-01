import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyUser = asyncHandler(async(req , res , next) =>{
    try {
        if (req.isAuthenticated()) {
            const googleID=req.user.id
            const loggedinUser=User.findOne({oauthId:googleID})

            req.loggedinUser=loggedinUser
            
            next()
       } 
    } catch (error) {
        throw new ApiError(401 , error?.message || "Unauthorized request")
    }
    
}); 