// index.js
const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.js');
const passport = require('./src/middleware/passport-google-auth')



const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

 const main = async() => {
 const PORT = process.env.PORT;
 const mongoURI = process.env.DATABASE_URI;

     try{
        // Connect to MongoDB
                await mongoose.connect(mongoURI)
                    .then(() => {
                        console.log('Connected to the Database');

                    })
                    .catch(err => console.error('Error connecting to MongoDB:', err));
                    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        // Define schema and models, perform CRUD operations, etc.
         }catch(err) {}
         }
 main();

 // Configure express-session
app.use(session({ 
    secret: 'keyboard cat', // This should be a long, random string used to sign the session ID cookie
    resave: false, 
    saveUninitialized: false 
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());  
// Use the imported routes
app.use('/auth', authRoutes);
// const crypto = require('crypto');

// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);


// Other routes...


