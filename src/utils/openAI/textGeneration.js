import { openAi } from "../../constants.js";

export const chatWithAssistant = async(userInput )=>{
    console.log(userInput)
    const completion = await openAi.chat.completions.create({
        messages :[
            {"role" : "system" , "content" : "act as an assistant"},
            {"role" : "user" , "content" : userInput }
        ],
        model : "gpt-3.5-turbo"
    });
    console.log(completion)
    return completion.choices[0].messages.content;
}


