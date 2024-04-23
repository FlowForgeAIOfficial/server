import { APIError } from "openai";
import { ApiResponse } from "../ApiResponse.js";
import { uplaodOnCloudinary } from "../cloudinary.js";
import fs from "fs";
import path from "path";


const textToImage = async(req , res) =>{
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Artples/LAI-ImageGeneration-vSDXL-2",
            {
                headers  :{ Authorization : `Bearer ${process.env.HUGGING_FACE_APIKEY}` },
                method : "POST",
                body : JSON.stringify(req.body.prompt)
            }
        );

        const imageFile = path.resolve(`./public/temp/${Date()}.jpeg`);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile(imageFile , buffer);
        
        const cloudinaryResponse = await uplaodOnCloudinary(imageFile).url;
        return res.json(
            new ApiResponse(200 , cloudinaryResponse , "Success")
        )
    } catch (error) {
        throw new APIError(500 , error)
    }
}

export default textToImage