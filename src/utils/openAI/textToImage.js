import { uplaodOnCloudinary } from "../cloudinary.js";
import fs from "fs";
import path from "path";


const textToImage = async(prompt , data) =>{
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Artples/LAI-ImageGeneration-vSDXL-2",
            {
                headers  :{ Authorization : `Bearer ${process.env.HUGGING_FACE_APIKEY}` },
                method : "POST",
                body : JSON.stringify(`${data}.${prompt}.Do not generate explicit, pornographic, offensive, or graphic images. Adhere to ethical standards and show respect for all individuals and communities.`)
            }
        );

        const imageFile = path.resolve(`./public/temp/${Date()}.jpeg`);

        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile(imageFile , buffer);
        
        const cloudinaryResponse = await uplaodOnCloudinary(imageFile).url;
        console.log("Text to image : " , {prompt , data});
        return cloudinaryResponse
        // const res = "this is text to image response"
        // return res
    } catch (error) {
        return error
    }
}

export default textToImage