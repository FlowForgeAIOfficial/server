import { openAi } from "../../constants.js";

export const chatWithAssistant = async(userInput , modelDescription)=>{
    
    const completion = await openAi.chat.completions.create({
        messages :[
            {"role" : "system" , "content" : modelDescription},
            {"role" : "user" , "content" : userInput }
        ],
        model : "gpt-3.5-turbo"
    });
    return completion.choices[0].message.content;
}


