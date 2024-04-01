const functionAndCodes = (functionCode , req , modelDetailsArray) =>{
    if(functionCode === 'input' || functionCode === 'output'){
        modelDetailsArray.push({functionCode})
    }
    else if(functionCode === 'gptNode'){
        modelDetailsArray.push({
            functionCode,
            gptDescription : req.body.gptDescription
        })
    }
    else if(functionCode === 'TextToSpeech'){
        modelDetailsArray.push({
            functionCode ,
            voice : req.body.speechDropDown
        })
    }
}
export default functionAndCodes

