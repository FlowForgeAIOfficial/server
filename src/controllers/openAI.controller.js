import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertTextToSpeech } from "../utils/openAI/textToSpeech.js";
import { chatWithAssistant } from "../utils/openAI/textGeneration.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const textToSpeech =async (input)=>{
    if(!input.inputText){
        throw new APIError(400 , "Input text not present.");
    }
    const speechFile = await convertTextToSpeech(inputText );
    
    return speechFile;
};


const gptGeneration  = async(input) =>{
    
    if(!input){
        throw new APIError(400 , "Input or gpt description not found,.")
    }
    const gptResponse = await chatWithAssistant(input);
    
    return gptResponse;
};

// const callFunction = async(functionCode , input) =>{
//     if(functionCode === 'input')return req.body.inputText;
//     if(functionCode === 'gptModel') {
//         const gptResponse =  await gptGeneration(input)
//         return gptResponse
//     }

//     if(functionCode === 'TextToSpeech'){
//         const speechFile = await textToSpeech(input);
//         return speechFile
//     }
//     if(functionCode === 'output'){
//         return input
//     }
// }
const callFunction = async (functionCode, inputText) => {
    console.log(functionCode)
    console.log(inputText)
    if (functionCode === 'input') return inputText;
    if (functionCode === 'gptGeneration') {
        const gptResponse = await gptGeneration(inputText);
       // console.log("Aarize")
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
        //console.log(req.body)
        const modelArray = req.modelFlow;
        //console.log(req.inputText)
        console.log(modelArray)
    // var currentInput=req.body.inputText;
    // for(var i=0;i<modelMapArray.length;i++){
    //     var mapping=modelMapArray[i];//{input : gptNode}
    //     var functionName=Object.keys(mapping)[0]; //{input}
    //     var nextFunction=mapping[functionName]; // gptNode
    //     currentInput=nextFunction(currentInput); // gptNode(inputText)
    // }


    // finalMap =[input , gptModel , TextToSpeech , output]
    var output =await callFunction(modelArray[0], req.body.inputText)

    for(let i=1 ; i<modelArray.length ; i++){
        const currentCall = await callFunction(modelArray[i] ,output);
        output = currentCall;
        console.log(output)
    }
   // return res.json(new ApiResponse(200,{modelArray , output} , "success"))
    } catch (error) {
        res.json(new ApiResponse(500,error , "error"))
    }
})

export {
    textToSpeech,
    gptGeneration,
    generateModel
}