// Example of verifyToken middleware
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded user information to req.user
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}
const verifyAdminToken = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        // If token is not provided
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Token is missing.' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token.' });
            }

            // Check if the user exists and is an admin
            const user = await User.findById(decoded.id);
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access forbidden. Only admins can access this endpoint.' });
            }

            // Add the decoded token to the request object for further use
            req.user = decoded;
            next(); // Proceed to the next middleware
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const requireRole = (role) => {
    return async (req, res, next) => {
        try {
            // Assuming the user's role is stored in the req.user object
            if (req.user && req.user.role === role) {
                next(); // Proceed to the next middleware/route handler
            } else {
                res.status(403).json({ message: 'Access forbidden. You do not have the required role.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

module.exports = { verifyToken, verifyAdminToken, requireRole};

