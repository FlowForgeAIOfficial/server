import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertTextToSpeech } from "../utils/openAI/textToSpeech.js";
import { chatWithAssistant } from "../utils/openAI/textGeneration.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserAIModel } from "../models/userAIModel.model.js";

const callFunction = async (modelFlow, input, i ,returnArray) => {
    console.log(modelFlow[i]);
    if (modelFlow[i].functionCode === 'input') {
        returnArray.push({input})
        return input
    }
    else if (modelFlow[i].functionCode === 'gptNode') {
        const gptResponse = await gptGeneration(input , modelFlow[i].gptDescription);
        returnArray.push(gptResponse)
        return gptResponse;
    }

    else if (modelFlow[i].functionCode === 'TextToSpeech') {
        const speechFile = await textToSpeech(input , modelFlow[i].voice);
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
        const modelId = req.modelId;
        const modelArray = req.modelFlow;
        var str =""
        for(let i=0 ; i<modelArray.length ; i++){
            str += `/${modelArray[i]}`
        }
        const url = `https://automai/${modelId}${str}`
        const updatedModel = await UserAIModel.findByIdAndUpdate(
            modelId,
            {
                $set :{
                    modelUrl : url
                }
            },
            {new : true}
        )
        return res
        .status(200)
        .json( new ApiResponse(200 , updatedModel , "Model created successfully."))
        
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
        console.log(modelFlow);
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


export {
    textToSpeech,
    gptGeneration,
    generateModelUrl,
    useModel
}