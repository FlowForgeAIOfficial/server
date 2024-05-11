
import { Router } from "express";
import {passport} from '../controllers/githubouth.controller.js'
import dotenv from 'dotenv'
dotenv.config()


const router = Router();

// Auth  
router.get('/githubauth' , passport.authenticate('github', { scope: ['user:email']
})); 
  
// Auth Callback 
router.get( '/github/callback', 
    passport.authenticate( 'github', { 
        successRedirect: '/githubAuth/callback/success', 
        failureRedirect: '/githubAuth/callback/failure'
})); 
  
// Success  
router.get('/githubAuth/callback/success' , (req , res) => { 
    if(!req.user) 
        res.redirect('/githubAuth/callback/failure');
    //res.json(req.user)
    res.redirect(process.env.AUTH_SUCCESS_URL) 

}); 


// failure 
router.get('/githubAuth/callback/failure' , (req , res) => { 
    res.send("Error"); 
}) 

export default router;