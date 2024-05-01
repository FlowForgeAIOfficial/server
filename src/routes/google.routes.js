import { Router } from "express";
import {passport} from '../controllers/googleouth.controller.js'

const router = Router();

router.get('/', (req, res) => { 
    res.send("<button><a href='/googleauth'>Login With Google</a></button>") 
}); 
  
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
    console.log(req.user); 
    console.log(req.isAuthenticated());
    //res.json(req.user)
    res.redirect("http://localhost:5173/home") 

}); 

// router.get('/helloaarize',(req,res)=>{
//     console.log("hello aarize")

//     console.log(req.user)
//     res.json(req.user)
// })
  
// failure 
router.get('/auth/callback/failure' , (req , res) => { 
    res.send("Error"); 
}) 

export default router;