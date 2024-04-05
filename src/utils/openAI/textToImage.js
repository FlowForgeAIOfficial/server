import { openAi } from "../../constants.js";

const textToImage = async(prompt , n , size) =>{
    try {
        const response = await openAi.images.generate({
            model : "dall-e-3",
            prompt : prompt,
            n : n,
            size : size
        })
        const {revisedPrompt , url} = response.data[0]
        return {revisedPrompt , url}        
    } catch (error) {
        return error
    }
}

export default textToImage