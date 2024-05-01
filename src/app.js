import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import openAiRouter from "./routes/openAI.routes.js"
import userRouter from "./routes/user.routes.js"
import cookieSession from "cookie-session"
import googleOAuthRouter from "./routes/google.routes.js"
import githubOAuthRouter from "./routes/github.routes.js"
import passport from "passport"

const app = express()

app.use(cors({
    origin: true,
    credentials: true,
    
    
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cookieSession({ 
    name: 'google-auth-session', 
    keys: ['key1', 'key2'] 
})); 

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/aiModel",openAiRouter)
app.use("/api/v1/user" , userRouter)

//oauth
app.use('/',googleOAuthRouter)
app.use('/',githubOAuthRouter)

app.post('/logout', function(req, res) {

        req.session = null;
        res.clearCookie('session'); // Clear session cookie
        res.status(200).send('Logged out');
      
    
  });
export { app }