const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

// function middleware(password) {
//     return function(req, res, next) {
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, password);

//         if (decoded) {
//             req.userId = decoded.id;
//             next()
//         } else {
//             res.status(403).json({
//                 message: "You are not signed in"
//             })
//         }    
//     }
// }

function adminMiddleware(req, res, next) {
    try {
        // Get token from Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Authorization header missing or invalid"
            });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            });
        }

        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        if (decoded) {
            req.userId = decoded.id;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        console.error("Admin auth error:", error.message);
        res.status(403).json({
            message: "Authentication failed"
        });
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}