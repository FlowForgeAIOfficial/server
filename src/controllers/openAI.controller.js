import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertTextToSpeech } from "../utils/openAI/textToSpeech.js";
import { chatWithAssistant } from "../utils/openAI/textGeneration.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const textToSpeech =async (input)=>{
    if(!input){
        throw new APIError(400 , "Input text not present.");
    }
    const fileUrl = await convertTextToSpeech(input);
    return fileUrl
};


const gptGeneration  = async(input) =>{
    
    if(!input){
        throw new APIError(400 , "Input or gpt description not found,.")
    }
    const gptResponse = await chatWithAssistant(input);
    
    return gptResponse;
};


const callFunction = async (functionCode, inputText) => {
    console.log(functionCode)
    console.log(inputText)
    if (functionCode === 'input') return inputText;
    if (functionCode === 'gptGeneration') {
        const gptResponse = await gptGeneration(inputText);
        return gptResponse;
    }

    if (functionCode === 'textToSpeech') {
        const speechFile = await textToSpeech(inputText);
        return speechFile;
    }
    if (functionCode === 'output') {
        return inputText;
    }
}



const generateModel = asyncHandler(async(req , res) =>{
    try {
        const modelArray = req.modelFlow;
        var output =await callFunction(modelArray[0], req.body.inputText)

        for(let i=1 ; i<modelArray.length ; i++){
            const currentCall = await callFunction(modelArray[i] ,output);
            output = currentCall;
            console.log(`${modelArray[i]}  : ${currentCall}`)
        }
        return res.json(new ApiResponse(200,{modelArray , output} , "success"))
    } catch (error) {
        res.json(new ApiResponse(500,error , "error"))
    }
})

export {
    textToSpeech,
    gptGeneration,
    generateModel
}