import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import modelDescriptionArray from "../utils/openAI/getModelMap.js";

export const generateModelDescriptionArray = asyncHandler(async(req, res , next) =>{
   
    try {
        const {dropArray , mapArray } = req.body;
        if(!dropArray || !mapArray){
            throw new APIError(400 , "Please create a model to deploy.")
        }
        const modelArray = modelDescriptionArray(dropArray , mapArray);
        req.modelFlow = modelArray;
        next();
    } catch (error) {
        throw new APIError(500 , error , "Cannot get model data flow.")
    }

});





