// routes/auth.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    // Login logic
    res.send('Login');
});

router.post('/register', (req, res) => {
    // Registration logic
    res.send('Register path');
});

router.get('/protected', (req, res) => {
    // Access granted to protected route
    res.send('Protected Path');
});

module.exports = router;
