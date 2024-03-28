// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const initializePassport = require('../middleware/passport.js');
const User = require('../models/Users.js');
// Import the AdminUserModel
const AdminUser = require('../models/adminUserModel.js');
const Tenant = require('../models/Tenant.js');
const {verifyToken, requireRole } = require('../middleware/index.js');
const { validateRegistration } = require('../middleware/validatorMiddleware');
const validateTenant = require('../middleware/validateTenant');

initializePassport(passport);

// Route for user registration
    router.post('/register',validateRegistration, async (req, res) => {
        try {
            // Extract user registration data from request body
            const { firstname, middlename, lastname, username,phonenumber, id, email, password } = req.body;

            // Check if the username or email already exists
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            // Create a new user instance
            const newUser = new User({ firstname, middlename, lastname, username, phonenumber, id, email, password, role: 'user' });

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
// Route for user login
router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        // If passport.authenticate('local') succeeds, the user object will be attached to req.user
        const user = req.user;

        // Create a payload containing user information
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });

        // Respond with success message and JWT
        res.json({ message: 'Login successful', token, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get logged in user's data
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Assuming your verifyToken middleware adds the user's ID to req.user
        const userId = req.user.id;
        
        // Fetch the user from the database
        const user = await User.findById(userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting  User Profile." });
    }
});
// fetch  all clients 
router.get('/users', verifyToken, async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting users." });
    }
});    
// Protected route example
router.get('/user', verifyToken, async (req, res) => {
    try {
        // Fetch user data using req.user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User accessed successfully.', user });
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
router.post('/tenant', verifyToken, requireRole('user'), async (req, res) => {
    try {
        // Extract tenant data from the request body
        const { firstName, middleName, lastName, idNumber, dateOfBirth, phoneNumber1, phoneNumber2, emergencyContact, email, address, lease } = req.body;

        // Ensure that only authenticated users can create tenants
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to create a tenant.' });
        }

        // Create the tenant associated with the authenticated user
        const userId = req.user.id; // Assuming userId is included in the token payload
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         // Create the tenant and assign it to the specified user
         const newTenant = await Tenant.create({
            firstName,
            middleName,
            lastName,
            idNumber,
            dateOfBirth,
            phoneNumber1,
            phoneNumber2,
            emergencyContact,
            email,
            address,
            createdBy: userId, // Assign the tenant to the specified user
            lease
        });
        // Now that tenant is created, you might want to fetch all tenants associated with the user again
        const tenants = await Tenant.find({ createdBy: userId });

        res.status(201).json({ message: 'Tenant created successfully.', tenant, tenants });
    } catch (error) {
        // Check if the error is a duplicate key error
        if (error.code === 11000) {
            // If a duplicate key error is detected, send an appropriate error response
            res.status(400).json({ message: "A tenant already exists with the provided email or ID number." });
        } else {
            // If the error is not a duplicate key error, send a generic error response
            res.status(500).json({ message: "An error occurred while creating the tenant.", error });
        }
    }
});

// get all tenants of the user
router.get('/tenants', verifyToken, requireRole('user'), async (req, res) => {
    try {
        // Ensure that only authenticated users can access their tenants
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to view your tenants.' });
        }

        // Retrieve the ID of the authenticated user from the token payload
        const userId = req.user.id;

        // Query the database to find all tenants associated with the user's ID
        const tenants = await Tenant.find({ createdBy: userId });

        // Return the list of tenants associated with the user
        res.status(200).json({ tenants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting the tenant." });
    }
});
module.exports = router;

