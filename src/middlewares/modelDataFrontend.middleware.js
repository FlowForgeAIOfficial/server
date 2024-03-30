import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    finalMap.push('output')
    console.log(finalMap)
    return finalMap;
}



export const modelDataFrontend = asyncHandler(async(req, res , next) =>{
   
    try {
        const {dropArray , mapArray} = req.body;
        const modelArray = getModelMap(dropArray , mapArray);
        req.modelFlow = modelArray;
        next();
    } catch (error) {
        throw new APIError(500 , error , "Cannot get model data flow.")
    }
});