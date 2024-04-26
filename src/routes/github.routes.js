import { Router } from "express";
import {passport} from '../controllers/githubouth.controller.js'

const router = Router()

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get("/github/callback",passport.authenticate("github",{
    successRedirect:"http://localhost:5173/home",
    failureRedirect:"http://localhost:5173/login"
}))


//secured routes
export default router