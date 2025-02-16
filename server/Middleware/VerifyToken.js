// const jsonwebtoken = require("jsonwebtoken");

// const verifyToken = async (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(403).json({
//       message: "No token provided, authorization denied",
//       success: false,
//     });
//   }

//   try {
//     const actualToken = token;
//     const decoded = jsonwebtoken.verify(actualToken, process.env.JWT_SECRET_KEY);
//     req.user = decoded; 
//     console.log(decoded);
//     next(); 
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid or expired token",
//       success: false,
//       error: error.message,
//     });
//   }
// };

// module.exports = verifyToken;
const jwt = require('jsonwebtoken');
const verifyUser = async (req, res, next) => {
    const token = req.cookies?.token;
    // console.log(req.cookies);
    // console.log(token);

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token, please login again" });
        }
        // console.log(payload)
        req.userId = payload.id;
        req.role = payload.role;
        req.email = payload.email;
        if (!req.userId) {
            return res.status(404).json({ message: "User not found, please log in" });
        }
        next();
    });
};

module.exports = { verifyUser };
