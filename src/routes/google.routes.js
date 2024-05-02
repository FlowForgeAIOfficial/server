import { Router } from "express";
import {passport} from '../controllers/googleouth.controller.js'

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
    res.redirect("http://localhost:5173/home") 

}); 


// failure 
router.get('/auth/callback/failure' , (req , res) => { 
    res.send("Error"); 
}) 

export default router;