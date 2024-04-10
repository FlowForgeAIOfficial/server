
const voiceTune = async(gender , accent , age , accent_strength , text , apiKey) =>{
    const response = await fetch('https://api.elevenlabs.io/v1/voice-generation/generate-voice' ,{
        method : "POST",
        headers :{
            "xi-api-key" : apiKey,
            "Contend-Type" : "application/json"
        },
        body : {gender , accent ,age , accent_strength , text}
    })
}