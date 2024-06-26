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

import mongoose , {Schema, model, mongo} from "mongoose";


const userAIModelSchema = new Schema(
    {

        userId : {
            type : Schema.Types.ObjectId,
            ref : "User",
            index : true
        },
        modelDescription :{
            type : String ,
            required : true
        },
        modelFlow :[
            mongoose.Schema.Types.Mixed
        ],
        modelUrl : {
            type : String
        },
        nodeInfo : {
            type : mongoose.Schema.Types.Mixed
        }
    } , {timestamps :true})

export const UserAIModel = mongoose.model("UserAIModel" , userAIModelSchema)