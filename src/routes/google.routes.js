import { Router } from "express";
import {passport} from '../controllers/googleouth.controller.js'
import dotenv from 'dotenv'
dotenv.config()

const router = Router();

// Auth  
router.get('/googleauth' , passport.authenticate('google', { scope: 
    [ 'email', 'profile' ] 
})); 
  
// Auth Callback 
router.get( '/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/callback/success', 
        failureRedirect: '/auth/callback/failure'
})); 
  
// Success  
router.get('/auth/callback/success' , (req , res) => { 
    if(!req.user) 
        res.redirect('/auth/callback/failure');
    //res.json(req.user)
    res.redirect(process.env.AUTH_SUCCESS_URL) 

}); 


// failure 
router.get('/auth/callback/failure' , (req , res) => { 
    res.send("Error"); 
}) 

export default router;