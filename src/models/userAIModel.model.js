// [
//     {
//         input : "input value"
//     },
//     {
//         gptNode : {
//             userInput : "userInput",
//             modelDescription : "value"
//         }
//     },
//     {
//         textToAudio : "audio file url from cloudinary"
//     },
//     {
//         output : "output value"
//     }
// ]

import mongoose , {Schema, model} from "mongoose";


const userAIModelSchema = new Schema(
    {

        userId : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        modelUrl :{
            type : String ,
            default : ""
        },
        modelFlow :[
            mongoose.Schema.Types.Mixed
        ]

    } , {timestamps :true})

export const UserAIModel = mongoose.model("UserAIModel" , userAIModelSchema)