import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import modelDescriptionArray from "../utils/openAI/getModelMap.js";
import { UserAIModel } from "../models/userAIModel.model.js";
import { User } from "../models/user.model.js";

const generateModelDescriptionArray = asyncHandler(async(req, res , next) =>{
   
    try {
        const {dropArray , mapArray , modelDescription } = req.body;
        const modelFound = await UserAIModel.findOne({modelDescription})
        if(modelFound){
            throw new APIError(405 , "Model already deployed.")
        }
        if(!dropArray || !mapArray){
            throw new APIError(400 , "Please create a model to deploy.")
        }
        const modelArray = modelDescriptionArray(dropArray , mapArray);
        console.log(modelArray);
        req.modelFlow = modelArray;
        next();
    } catch (error) {
        throw new APIError(500, "Cannot get model data flow.")
    }

});


const generateModelUrl = asyncHandler(async(req, res , next) =>{
    try {
        const user = await User.findById(req.user._id);
        const userSecret =  user.userSecret
        console.log(userSecret);
        const deployedModel = await UserAIModel.create({
            userId : req.user._id,
            modelDescription : req.body.modelDescription,
            modelFlow : req.modelFlow
        })
        const url = `http://localhost:8000/api/v1/aiModel/useModel?modelId=${deployedModel._id}&userSecret=${userSecret}`
        console.log(url);
        const updatedModel = await UserAIModel.findByIdAndUpdate(
            deployedModel._id,
            {
                $set : {
                    modelUrl : url
                }
            },
            {new : true}
        )
        console.log(updatedModel);
        req.deployedModel = updatedModel;
        next()
        
    } catch (error) {
        throw new APIError(500 , error , "Unable to update model url .")
    }
})

export {
    generateModelDescriptionArray,
    generateModelUrl
}




