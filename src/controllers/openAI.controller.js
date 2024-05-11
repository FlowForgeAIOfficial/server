import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertTextToSpeech } from "../utils/openAI/textToSpeech.js";
import { chatWithAssistant } from "../utils/openAI/textGeneration.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserAIModel } from "../models/userAIModel.model.js";
import { ModelCoordinate } from "../models/modelCoordinate.model.js";
import { User } from "../models/user.model.js";
import  usingModels  from "../utils/openAI/useModels.js";
import dotenv from 'dotenv'
dotenv.config()


const textToSpeech =async (input , voice)=>{
    if(!input){
        throw new APIError(400 , "Input text not present.");
    }
    const fileUrl = await convertTextToSpeech(input ,voice);
    return fileUrl
};

const gptGeneration  = async(input , modelDescription) =>{
    
    if(!input){
        throw new APIError(400 , "Input or gpt description not found,.")
    }
    const gptResponse = await chatWithAssistant(input , modelDescription);
    
    return gptResponse;
};

const saveCoordinates = asyncHandler(async(req, res) =>{
    try {
        const modelId = req.deployedModel._id;
        const modelCoordinates = req.body.coordinateObject;
        if(!modelCoordinates){
            throw new APIError(400 , "Model coordinates not found.")
        }
        const coordinate = await ModelCoordinate.create({
            modelId : modelId,
            coordinateObject : modelCoordinates
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    deployedModel : req.deployedModel,
                    coordinate
                },
                "Model deployed successfully."
            )
        )
    } catch (error) {
        throw new APIError(500 , "Something went wrong while saving model coordinates.")
    }

})



const useModel = asyncHandler(async(req, res) => {
    try {
        const {modelId , userSecret } = req.query;
       
        const {inputText} = req.body;
        const user = await User.findOne({userSecret})
        if(!user){
            throw new APIError(404 , "Invalid userSecret credential.")
        }
        const model = await UserAIModel.findById(modelId)
        if(!model){
            throw new APIError(404 , "Invalid modelId.")
        }
        const {modelFlow , nodeInfo} = model;
        
        const outputs = await usingModels(modelFlow ,nodeInfo , inputText)
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                outputs,
                "Model called successfully."
            )
        )        

    } catch (error) {
        throw new APIError(500 , error , error.message)
    }
})

const getModels = asyncHandler(async(req, res) =>{
    try {
        

        const models=await UserAIModel.find({userId:req.loggedinUser._id})
       // console.log(models)
        if(models.length === 0){
            return res.status(200).json(new ApiResponse(200 ,{} , "Nothing to show"))
        }

        return res.status(200).json(new ApiResponse(200 , models , "User's ai models fetched successfully."))
      
    } catch (error) {
        throw new APIError(500 , "Something went wrong while fetchin your ai models.")
    }
})

const getModel = asyncHandler(async(req, res) =>{
    try {
        const modelId = req.query.modelId;
        const model = await UserAIModel.findById({_id : modelId})
        //console.log(model)
        if(!model){
            throw new APIError(404 , "Model not found.")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200 , model , "Successfully fetched user model.")
        )
    } catch (error) {
        throw new APIError(500 , error , "Something went wrong while fetching your model.")
    }
})

const getModelAxes = asyncHandler(async(req, res) =>{
    try {
        const modelId = req.query.modelId;
       // console.log(modelId)
        const modelAxes = await ModelCoordinate.findOne({modelId})
        //console.log(modelAxes)
        if(!modelAxes){
            throw new APIError(404 , "Model not found.")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200 , modelAxes , "Successfully fetched user model.")
        )
    } catch (error) {
        throw new APIError(500 , error , "Something went wrong while fetching your model.")
    }
})

const deleteModel = asyncHandler(async(req , res) =>{
    try {
        const modelId = req.query.modelId;
        await UserAIModel.findByIdAndDelete(modelId);
        await ModelCoordinate.deleteOne({modelId})
        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , {} , `Successfully deleted model with modelID : ${modelId}`
            )
        )
    } catch (error) {
        throw new APIError(500 , "Failed to delete model.")
    }
})


export {
    textToSpeech,
    gptGeneration,
    useModel,
    getModels,
    getModel,
    saveCoordinates,
    getModelAxes,
    deleteModel
}