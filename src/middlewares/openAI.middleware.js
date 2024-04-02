import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserAIModel } from "../models/userAIModel.model.js";
import functionAndCodes from "../utils/openAI/functionAndCodes.js";

const getModelMap = (dropArray , mapArray)=>{
    let values = new Array(dropArray.length);
    for(let i=0 ; i<dropArray.length ; i++){
        let index = parseInt(dropArray[i].key);
        let value = dropArray[i].value;
        values[index] = value;
    }
    let map =[]
    for(let i=0 ; i<mapArray.length ; i++){
        let key  = parseInt(mapArray[i].key);
        let value = parseInt(mapArray[i].value);
        map.push({
            [values[key]] : values[value]
        });
    }
    var finalMap = []
    for(let i=0 ; i<map.length ; i++){
        finalMap.push(Object.keys(map[i])[0]) 
    }
    console.log(finalMap)
    finalMap.push('output')
    
    return finalMap;
}

export const generateModelDescriptionArray = asyncHandler(async(req, res , next) =>{
   
    try {
        const {dropArray , mapArray , modelId} = req.body;
        const modelArray = getModelMap(dropArray , mapArray);
        req.modelFlow = modelArray;
        var modelDetailsArray = []
        for(let i=0 ; i<modelArray.length ; i++){
            functionAndCodes(modelArray[i] ,req , modelDetailsArray) 
        }
        req.modelFlow = modelDetailsArray;
        next();
    } catch (error) {
        throw new APIError(500 , error , "Cannot get model data flow.")
    }
});





