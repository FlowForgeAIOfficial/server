import passport from 'passport';
import { User } from '../models/user.model.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import generateRandomString from '../utils/randomStringGenerator.js';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/google/callback`,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
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
        done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

export { passport };


