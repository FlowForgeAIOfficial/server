import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import openAiRouter from "./routes/openAI.routes.js"
import userRouter from "./routes/user.routes.js"



const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/aiModel",openAiRouter)
app.use("/api/v1/user" , userRouter)
export { app }