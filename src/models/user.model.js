import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        displayName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        userSecret : {
            type : String ,
            required : true
        },
        imageUrl : {
            type : String,
        },
        refreshToken : {
            type : String,
            required : true
        },
        oauthId : {
            type : String,
            required : true
        }

    },
    {
        timestamps: true
    }
)



userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            displayName : this.displayName,
            userSecret : this.userSecret
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)