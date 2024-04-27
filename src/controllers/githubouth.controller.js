import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';
import generateRandomString from '../utils/randomStringGenerator.js';
dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/github/callback`,
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = new User({
            email : profile.email,
            displayName : profile.displayName,
            userSecret : generateRandomString(8),
            imageUrl : profile.photos[0].value,
            refreshToken,
            oauthId : profile.id
        })

        await User.save()
        return done(null , profile)
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


