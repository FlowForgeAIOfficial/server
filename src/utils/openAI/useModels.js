import { gptGeneration ,textToSpeech } from "../../controllers/openAI.controller.js";
import textToImage from "./textToImage.js";


const callFunction1 = async (path,nodeInfo , input, i ,returnArray) => {
    if (nodeInfo[path[i]].functionCode === 'input') {
        returnArray.push({input})
        return input
    }
    else if (nodeInfo[path[i]].functionCode === 'gptNode') {
        const gptResponse = await gptGeneration(input , modelFlow[i].data);
        returnArray.push({gptResponse})
        return gptResponse;
    }

    else if (nodeInfo[path[i]].functionCode === 'TextToAudio') {
        const speechFile = await textToSpeech(input , modelFlow[i].data);
        returnArray.push({speechFile})
        return speechFile;
    }
    else if (nodeInfo[path[i]].functionCode === 'output') {
        returnArray.push({output : input})
        return input;
    }
    else if(nodeInfo[path[i]].functionCode === 'TextToImage'){
        const fileUrl = await textToImage(input)
        returnArray.push({imageUrl : fileUrl})
        return fileUrl;
    }
    
}


const callFunction = async(path , nodeInfo , inputText)=>{
    const output = [];
    var cur = callFunction1(path , nodeInfo , inputText , 0 , output)
    const slicedPath = path.slice(0);
    path.forEach(element => {
        const currentCall = callFunction1(path , nodeInfo , cur, element, output ) 
        console.log({currentCall});
        return currentCall
    });
}

const usingModels = async(modelFlow ,nodeInfo, inputText) => {
    try {
        const outputs = await Promise.all(modelFlow.map((path)=> callFunction(path , nodeInfo , inputText)));
        return outputs;
    } catch (error) {
        return error
    }
}

export default usingModels