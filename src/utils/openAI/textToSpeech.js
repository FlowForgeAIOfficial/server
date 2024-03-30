import fs from "fs"
import path from "path";
import { openAi } from "../../constants.js";

const speechile =  path.resolve(`../../public/temp/${Date()}.mp3`)

export const convertTextToSpeech = async(inputText ) =>{
    const mp3 = await openAi.audio.speech.create({
        model : "tts-1",
        voice : "alloy",
        input : inputText
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechile ,buffer);
    return speechile;    
}
