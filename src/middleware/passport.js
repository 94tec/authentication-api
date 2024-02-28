const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users.js');
const bcrypt = require('bcrypt');
function initialize(passport){
    passport.use(new LocalStrategy(async function(username, password, done) {
        try {
          const user = await User.findOne({ username });
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }));
      
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(async function(id, done) {
        try {
          const user = await User.findById(id);
          done(null, user);
        } catch (error) {
          done(error);
        }
    });
      
}
module.exports = initialize;
