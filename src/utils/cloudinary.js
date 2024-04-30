import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECCRET
})

// keeping the file on local  server and try  to upload to cloudinary 
// if uploaded successfully then unlink the file 

const uplaodOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath)return null
        //upload file 
        const response = await cloudinary.uploader.upload(localFilePath ,{
            resource_type : "auto"
        });
        //unlink after uploading
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        // unlink from the server
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromClodinary = async(public_id)=>{

}

export {uplaodOnCloudinary , deleteFromClodinary};