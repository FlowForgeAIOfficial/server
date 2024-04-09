import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import modelDescriptionArray from "../utils/openAI/getModelMap.js";
import { UserAIModel } from "../models/userAIModel.model.js";

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
        req.modelFlow = modelArray;
        next();
    } catch (error) {
        throw new APIError(500 , error , "Cannot get model data flow.")
    }

});


const generateModelUrl = asyncHandler(async(req, res , next) =>{
    try {
        const modelArray = req.modelFlow
        
        const deployedModel = await UserAIModel.create({
            userId : req.user._id,
            modelDescription : req.body.modelDescription,
            modelFlow : req.modelFlow
        })
        var str =""
        for(let i=0 ; i<modelArray.length ; i++){
            str += `/${modelArray[i].functionCode}`
        }
        const url = `https://automai/${deployedModel._id}${str}`
        const updateModel = await UserAIModel.findByIdAndUpdate(
            deployedModel._id,
            {
                $set : {
                    modelUrl : url
                }
            },
            {new : true}
        )
        req.deployedModel = updateModel;
        next()
        
    } catch (error) {
        throw new APIError(500 , error , "Unable to update model url .")
    }
})

export {
    generateModelDescriptionArray,
    generateModelUrl
}




