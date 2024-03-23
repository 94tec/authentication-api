// validatorMiddleware.js
const { check, validationResult } = require('express-validator');

// Validation middleware for user registration
const validateRegistration = [
    check('firstname').notEmpty().withMessage('First name is required'),
    check('lastname').notEmpty().withMessage('Last name is required'),
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        async (req, res, next) => {
            try{
              // Check for validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                // If validation passes, proceed to the next middleware or route handler
                next();  
            }catch (error) {
                // Pass the error to the error handling middleware
                next(error);
            }
        }
];
// validatorMiddleware.js

// Middleware function to validate login request
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email is in valid format (you can add more comprehensive email validation if needed)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Continue to the next middleware if all validations pass
    next();
};

module.exports = { validateRegistration, validateLogin};
