import textToImage from "./textToImage.js";
import { chatWithAssistant } from "./textGeneration.js";
import { convertTextToSpeech } from "./textToSpeech.js";

const callFunction1 = async (path, nodeInfo, input, i, output) => {
    if (nodeInfo[path[i]].functionCode === 'input') {
        output.push({ type: 'input', value: input });
        return input;
    } else if (nodeInfo[path[i]].functionCode === 'gptNode') {
        const gptResponse = await chatWithAssistant(input, nodeInfo[path[i]].data);
        output.push({ type: 'gptResponse', value: gptResponse });
        return gptResponse;
    } else if (nodeInfo[path[i]].functionCode === 'TextToAudio') {
        const speechFile = await convertTextToSpeech(input, nodeInfo[path[i]].data);
        output.push({ type: 'speechFile', value: speechFile });
        return speechFile;
    } else if (nodeInfo[path[i]].functionCode === 'output') {
        output.push({ type: 'output', value: input });
        return input;
    } else if (nodeInfo[path[i]].functionCode === 'TextToImage') {
        const fileUrl = await textToImage(input, nodeInfo[path[i]].data);
        output.push({ type: 'imageUrl', value: fileUrl });
        return fileUrl;
    }
};

const callFunction = async (path, nodeInfo, inputText) => {
    const output = [];
    let cur = inputText;
    
    for (let i = 0; i < path.length; i++) {
        cur = await callFunction1(path, nodeInfo, cur, i, output);
    }
    
    return output;
};

const usingModels = async (modelFlow, nodeInfo, inputText) => {
    try {
        const functionArray = [];
        for (let i = 0; i < modelFlow.length; i++) {
            // Push actual async function calls into the array
            functionArray.push(callFunction(modelFlow[i], nodeInfo, inputText));
        }
        
        const calls = await Promise.all(functionArray);
        return calls;

        
    } catch (error) {
        throw error;
    }
};

export default usingModels;
