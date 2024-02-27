// index.js
const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.js');



const app = express();
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

// Use the imported routes
app.use('/auth', authRoutes);
// const crypto = require('crypto');

// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);


// Other routes...


