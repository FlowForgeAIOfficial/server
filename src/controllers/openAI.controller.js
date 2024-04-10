import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertTextToSpeech } from "../utils/openAI/textToSpeech.js";
import { chatWithAssistant } from "../utils/openAI/textGeneration.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserAIModel } from "../models/userAIModel.model.js";
import { ModelCoordinate } from "../models/modelCoordinate.model.js";
import textToImage from "../utils/openAI/textToImage.js";
import { User } from "../models/user.model.js";

const callFunction = async (modelFlow, input, i ,returnArray) => {
    if (modelFlow[i].functionCode === 'input') {
        returnArray.push({input})
        return input
    }
    else if (modelFlow[i].functionCode === 'gptNode') {
        const gptResponse = await gptGeneration(input , modelFlow[i].data);
        returnArray.push({gptResponse})
        return gptResponse;
    }

    else if (modelFlow[i].functionCode === 'TextToAudio') {
        const speechFile = await textToSpeech(input , modelFlow[i].data);
        returnArray.push({speechFile})
        return speechFile;
    }
    else if (modelFlow[i].functionCode === 'output') {
        returnArray.push({output : input})
        return input;
    }
    else if(modelFlow[i].functionCode === 'TextToImage'){
        const {revisedPrompt ,url} = await textToImage(input , modelFlow[i].data.n , modelFlow[i].data.size);
        returnArray.push({revisedPrompt , imageUrl : url});
        return dallEResponse;
    }
    
}

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
        const {modelId , userSecret} = req.query;
        const {inputText} = req.body;
        const user = await User.findOne({userSecret})
        if(!user){
            throw new APIError(404 , "Invalid userSecret credential.")
        }
        const model = await UserAIModel.findById(modelId)
        if(!model){
            throw new APIError(404 , "Invalid modelId.")
        }
        const modelFlow = model.modelFlow;
        var returnArray = []
        var output = await callFunction(modelFlow ,inputText ,0 ,returnArray);
        for(let i=1 ; i<modelFlow.length ; i++){
            const currentCall = await callFunction(modelFlow , output ,i,returnArray)
            output = currentCall
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                returnArray,
                "Model called successfully."
            )
        )        

    } catch (error) {
        throw new APIError(500 , error , error.message)
    }
})

const getModels = asyncHandler(async(req, res) =>{
    try {
        const userId = req.user._id;
        if(!userId){
            throw new APIError(401 , "Unauthorized request.")
        }
        const models = await UserAIModel.find({userId});

        if(models.lenght === 0){
            return res.status(200).json(
                new ApiResponse(200 ,{} , "Please deploy models to access them")
            )
        }
        return res
        .status(200)
        .json(
            new ApiResponse(200 , models , "User's ai models fetched successfully.")
        )

    } catch (error) {
        throw new APIError(500 , "Something went wrong while fetchin your ai models.")
    }
})

const getModel = asyncHandler(async(req, res) =>{
    try {
        const modelId = req.query.modelId;
        const model = await UserAIModel.findById({_id : modelId})
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
        console.log(modelId)
        const modelAxes = await ModelCoordinate.findById(modelId)
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


export {
    textToSpeech,
    gptGeneration,
    useModel,
    getModels,
    getModel,
    saveCoordinates,
    getModelAxes
}