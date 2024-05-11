import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
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
  
passport.use(new GitHubStrategy({ 
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/github/callback`,
    scope: ['user:email'], 
    passReqToCallback:true
  }, 
  async(request, accessToken, refreshToken, profile, done)=> { 
    try {
      console.log(profile)
      const user = await User.findOne({oauthId : profile.id})
      if(!user){
          const newUser = new User({
              email : profile.emails[0].value,
              displayName : profile.username,
              userSecret : generateRandomString(8),
              imageUrl : profile._json.avatar_url,
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