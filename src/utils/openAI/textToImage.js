import { uplaodOnCloudinary } from "../cloudinary.js";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv'
dotenv.config()

const textToImage = async(prompt , data) =>{
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Artples/LAI-ImageGeneration-vSDXL-2",
            {
                headers  :{ Authorization : `Bearer ${process.env.HUGGING_FACE_APIKEY}` },
                method : "POST",
                body : JSON.stringify(`${data}.${prompt}.`)
            }
        );
        const imageFile = path.resolve(`./public/temp/${Date()}.jpg`);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile(imageFile , buffer);
        
        const cloudinaryResponse = await uplaodOnCloudinary(imageFile);
        return cloudinaryResponse
        
    } catch (error) {
        return error
    }
}

export default textToImage