const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next) => {
    try {
        // Extract the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token, please login again" });
            }

            // Attach user data to the request object
            req.userId = payload.id;
            req.role = payload.role;
            req.email = payload.email;

            if (!req.userId) {
                return res.status(404).json({ message: "User not found, please log in" });
            }

            // Continue to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.error("Error in verifyUser middleware:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

module.exports = { verifyUser };
