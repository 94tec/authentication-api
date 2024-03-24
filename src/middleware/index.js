const jwt = require('jsonwebtoken');
require('dotenv').config();
// Middleware to verify JWT token
function verifyToken(req, res, next) {
    // Get the token from the request headers
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    // If token is not provided
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token is missing.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        // Add the decoded token to the request object for further use
        req.user = decoded;
        next(); // Proceed to the next middleware
    });
}

module.exports = verifyToken;
