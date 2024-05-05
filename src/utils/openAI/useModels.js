import { gptGeneration ,textToSpeech } from "../../controllers/openAI.controller.js";
import textToImage from "./textToImage.js";
import async from 'async'


const callFunction1 = async (path,nodeInfo , input, i ,returnArray) => {
    if (nodeInfo[path[i]].functionCode === 'input') {
        returnArray.push({input})
        return input
    }
    else if (nodeInfo[path[i]].functionCode === 'gptNode') {
        const gptResponse = await gptGeneration(input , nodeInfo[path[i]].data);
        returnArray.push({gptResponse})
        return gptResponse;
    }

    else if (nodeInfo[path[i]].functionCode === 'TextToAudio') {
        const speechFile = await textToSpeech(input , nodeInfo[path[i]].data);
        returnArray.push({speechFile})
        return speechFile;
    }
    else if (nodeInfo[path[i]].functionCode === 'output') {
        returnArray.push({output : input})
        return input;
    }
    else if(nodeInfo[path[i]].functionCode === 'TextToImage'){
        const fileUrl = await textToImage(input , nodeInfo[path[i]].data)
        returnArray.push({imageUrl : fileUrl})
        return fileUrl;
    }

    
}


const callFunction = async(path , nodeInfo , inputText , res)=>{
    const output = [];
    var cur = await callFunction1(path , nodeInfo , inputText , 0 , output)
    for(let i=1 ; i<path.length ; i++){
        const currentCall = callFunction1(path , nodeInfo , cur, i, output ) 
        console.log({currentCall});
    }
    res.push(output)
    console.log(output);
}

const usingModels = async(modelFlow ,nodeInfo, inputText) => {
    try {
        const functionArray = [];
        const res = [];
        for(let i=0 ; i<modelFlow.length ; i++){
            functionArray.push(callFunction(modelFlow[i] , nodeInfo , inputText , res))
        }
        async.parallel(functionArray , function(err , res){
            console.log(res);
        })

        return res;
    } catch (error) {
        return error
    }
}

export default usingModels