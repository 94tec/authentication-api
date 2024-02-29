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
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // If validation passes, proceed to the next middleware or route handler
            next();
        }
];

module.exports = { validateRegistration };
