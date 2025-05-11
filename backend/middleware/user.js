const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next) {
    try {
        // Get token from Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        console.log("Auth header:", authHeader);
        
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

        try {
            const decoded = jwt.verify(token, JWT_USER_PASSWORD);
            console.log("Decoded token:", decoded);
            
            if (decoded && decoded.id) {
                req.userId = decoded.id;
                next();
            } else {
                console.error("Invalid token payload:", decoded);
                res.status(403).json({
                    message: "Invalid token payload"
                });
            }
        } catch (jwtError) {
            console.error("JWT verification error:", jwtError.message);
            res.status(403).json({
                message: "Invalid or expired token"
            });
        }
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(500).json({
            message: "Authentication failed",
            error: error.message
        });
    }
}

module.exports = {
    userMiddleware: userMiddleware
}