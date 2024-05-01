import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import generateRandomString from '../utils/randomStringGenerator.js'
dotenv.config();

passport.serializeUser((user , done) => { 
    done(null , user); 
}) 
passport.deserializeUser(function(user, done) { 
    done(null, user); 
}); 
  
passport.use(new GoogleStrategy({ 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/google/callback`,
    scope: ['profile', 'email'], 
    passReqToCallback:true
  }, 
  async(request, accessToken, refreshToken, profile, done)=> { 
    try {

      const user = await User.findOne({oauthId : profile.id})
      if(!user){
          const newUser = new User({
              email : profile.emails[0].value,
              displayName : profile.displayName,
              userSecret : generateRandomString(8),
              imageUrl : profile.photos[0].value,
              oauthId : profile.id
          })

          await newUser.save()
      }
      return done(null, profile);
      
    } catch (error) {
       return done(error, false);
    }
  } 
));

export { passport}