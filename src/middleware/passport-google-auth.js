// passport-google-auth.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth//google/redirect'
  },
  function(accessToken, refreshToken, profile, done) {
    // Verify callback function
    // Use the profile information (e.g., profile.id) to check if the user is already registered in your database
    // If the user is found, you can call done(null, user) to authenticate the user
    // If the user is not found, you can create a new user and call done(null, newUser) to authenticate the new user
    return done(null, profile);
  }
));

module.exports = passport;
