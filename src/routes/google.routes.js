import { Router } from "express";
import {passport} from '../controllers/googleouth.controller.js'

const router = Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/home",
    failureRedirect:"http://localhost:5173/login"
}))


//secured routes
export default router