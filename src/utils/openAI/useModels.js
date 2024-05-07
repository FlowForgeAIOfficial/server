import { gptGeneration ,textToSpeech } from "../../controllers/openAI.controller.js";
import textToImage from "./textToImage.js";
import async from 'async'


const callFunction1 = async (path,nodeInfo , input, i ,output) => {
    if (nodeInfo[path[i]].functionCode === 'input') {
        output.push({ type: 'input', value: input })
        
        return input
    }
    else if (nodeInfo[path[i]].functionCode === 'gptNode') {
        const gptResponse = await gptGeneration(input , nodeInfo[path[i]].data);
        output.push({type:'gptResponse', value: gptResponse})
        // console.log(output)
        
        return gptResponse;
    }

    else if (nodeInfo[path[i]].functionCode === 'TextToAudio') {
        const speechFile = await textToSpeech(input , nodeInfo[path[i]].data);
        output.push({type:'speechFile',value:speechFile})
        return speechFile;
    }
    else if (nodeInfo[path[i]].functionCode === 'output') {
        output.push({type:'output', value: input})
        return input;
    }
    else if(nodeInfo[path[i]].functionCode === 'TextToImage'){
        const fileUrl = await textToImage(input , nodeInfo[path[i]].data)
        output.push({type : 'imageUrl' , value : fileUrl})
        return fileUrl;
    }
    
}


const callFunction = async(path , nodeInfo , inputText , res)=>{
    const output = [];
    
    var cur =await  callFunction1(path , nodeInfo , inputText , 0 , output)
    for(let i=1 ; i<path.length ; i++){
        const currentCall = await  callFunction1(path , nodeInfo , cur, i, output ) 
        cur=currentCall
        // console.log({i , output});
    }
    console.log({output})
    res.push(output)
    // console.log(output);
}

const usingModels = async(modelFlow ,nodeInfo, inputText) => {
    try {
        const functionArray = [];
        const res = [];
        for(let i=0 ; i<modelFlow.length ; i++){
            functionArray.push( callFunction(modelFlow[i] , nodeInfo , inputText , res))
        }
        console.log({functionArray})
        const calls = await async.parallel(functionArray);
        
        console.log({calls});
        return calls
        
    } catch (error) {
        return error
    }
}

export default usingModels