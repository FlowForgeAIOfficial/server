import fs from "fs";
import path, { resolve } from "path";
import dotenv from 'dotenv'
import { uplaodOnCloudinary } from "../utils/cloudinary.js";
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
        console.log(response);
        const imageFile = path.resolve(`./public/temp/${Date()}.jpg`);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile(imageFile , buffer);
        
        const cloudinaryResponse = await uplaodOnCloudinary(imageFile);
        return cloudinaryResponse
        
    } catch (error) {
        return error
    }
}

const res = await textToImage("Astronaut riding horse")
console.log(res);