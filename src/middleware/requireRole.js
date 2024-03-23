// Middleware function to require specified role
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
};


module.exports =  requireRole;
