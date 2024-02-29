// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const initializePassport = require('../middleware/passport.js');
const router = express.Router();
const User = require('../models/Users.js');
const verifyToken = require('../middleware/index.js');


initializePassport(passport);

// Configure express-session

    // Route for user login
router.post('/login', passport.authenticate('local'), async (req, res) => {
    try {
        // Extract login credentials from request body
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with success message and JWT
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Route for user registration
router.post('/register',  async (req, res) => {
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

// Protected route example
router.get('/protected', verifyToken, async (req, res) => {
    try {
        // Fetch user data using req.user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'Protected route accessed successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/logout', (req, res) => {
    // Clear any session data or invalidate the token on the server-side
    // You may choose to do additional cleanup tasks here
    
    res.json({ message: 'Logout successful' });
});

//auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('//google/redirect',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});
module.exports = router;
