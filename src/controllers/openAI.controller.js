import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertTextToSpeech } from "../utils/openAI/textToSpeech.js";
import { chatWithAssistant } from "../utils/openAI/textGeneration.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserAIModel } from "../models/userAIModel.model.js";

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


const generateModelUrl = asyncHandler(async(req, res  , next) =>{
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
        return res
        .status(200)
        .json( new ApiResponse(200 , updateModel , "Model created successfully."))
        
    } catch (error) {
        throw new APIError(500 , error , "Unable to update model url .")
    }
})


const useModel = asyncHandler(async(req, res) =>{
    try {
        const {modelId , inputText} = req.body;
        if(!modelId){
            throw new APIError(404 , "input modelId not found")
        }
        const aiModel = await UserAIModel.findById(modelId);
        if(!aiModel){
            throw new APIError(404 , "Model not found for the modelId")
        }
        const modelFlow = aiModel.modelFlow;
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
        throw new APIError(500 , error , "Something went wrong")
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
        const modelId = req.body.modelId;
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

export {
    textToSpeech,
    gptGeneration,
    generateModelUrl,
    useModel,
    getModels,
    getModel
}