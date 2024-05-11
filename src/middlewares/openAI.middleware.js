import { APIError } from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserAIModel } from "../models/userAIModel.model.js";
import { User } from "../models/user.model.js";
import { findPath,  nodeInfo } from "../utils/openAI/getModelMap.js";
import getStartEndNode from "../utils/openAI/getStartEndNode.js";
import dotenv from 'dotenv'
dotenv.config()


const generateModelUrl = asyncHandler(async(req, res , next) =>{
    try {
        const user = await User.findById(req.loggedinUser._id);
        console.log(user);
        const userSecret =  user.userSecret
        console.log(userSecret);
        const deployedModel = await UserAIModel.create({
            userId : req.loggedinUser._id,
            modelDescription : req.body.modelDescription,
            modelFlow : req.paths ,
            nodeInfo : req.nodeInfo
        })
        const url = `${process.env.MODEL_BASE_URL}/useModel?modelId=${deployedModel._id}&userSecret=${userSecret}`
        console.log(url);
        const updatedModel = await UserAIModel.findByIdAndUpdate(
            deployedModel._id,
            {
                $set : {
                    modelUrl : url
                }
            },
            {new : true}
        )
        console.log(updatedModel);
        req.deployedModel = updatedModel;
        next()
        
    } catch (error) {
        throw new APIError(500 , error , "Unable to update model url .")
    }
})


const createPaths = asyncHandler(async(req , res , next) =>{
    try {
        const adjacencyList = {};
        req.body.mapArray.forEach(item => {
            const key = item.key;
            const value  = item.value;
            if(!adjacencyList[key]){
                adjacencyList[key] = [];
            }
            adjacencyList[key].push(value)
        });

        const nodeData = nodeInfo(req.body.dropArray);

        const nodes = getStartEndNode(req.body.dropArray)
        const startNode = nodes[0];
        const endNode = nodes[1];

        const paths = findPath(adjacencyList , startNode , endNode);
        req.paths = paths;
        req.nodeInfo = nodeData;
        console.log({nodeData});
        next();
        
    } catch (error) {
        throw new APIError(500 ,error , "Something went wrong")
    }
 });

export {
    generateModelUrl,
    createPaths
}




