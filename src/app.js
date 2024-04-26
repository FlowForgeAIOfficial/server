import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import openAiRouter from "./routes/openAI.routes.js"
import userRouter from "./routes/user.routes.js"
import session from "express-session";
import googleOAuthRouter from "./routes/google.routes.js"
import githubOAuthRouter from "./routes/github.routes.js"
import passport from "passport"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(session({
    secret:"YOUR SECRET KEY BAD ME ENV SE DAAL DENGE",
    resave:false,
    saveUninitialized:true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/aiModel",openAiRouter)
app.use("/api/v1/user" , userRouter)

//oauth
app.use('/',googleOAuthRouter)
app.use('/',githubOAuthRouter)
export { app }