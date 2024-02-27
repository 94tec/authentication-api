// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');
router.post('/login', (req, res) => {
    // Login logic
    res.send('Login');
});

// Route for user registration
router.post('/register', async (req, res) => {
    try {
        // Extract user registration data from request body
        const { firstname, lastname, username, email, password } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Create a new user instance
        const newUser = new User({firstname,lastname, username, email, password });

        // Save the new user to the database
        await newUser.save();
        console.log('User Created, Welcome');

        // Generate JWT for the newly registered user
        const token = newUser.generateJWT();

        // Respond with success message and JWT
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/protected', (req, res) => {
    // Access granted to protected route
    res.send('Protected Path');
});

module.exports = router;
