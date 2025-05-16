const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const  { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }
        
        // Create new user
        await userModel.create({
            email,
            password,
            firstName, 
            lastName
        });
        
        res.status(201).json({
            message: "Signup succeeded"
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Error creating user account"
        });
    }
});

userRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userModel.findOne({
            email,
            password
        });

        if (user) {
            // Generate JWT token
            const token = jwt.sign({
                id: user._id,
            }, JWT_USER_PASSWORD);

            res.json({
                token
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Error during authentication"
        });
    }
});

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    try {
        const userId = req.userId;

        const purchases = await purchaseModel.find({
            userId,
        });

        let purchasedCourseIds = [];

        for (let i = 0; i < purchases.length; i++){ 
            purchasedCourseIds.push(purchases[i].courseId);
        }

        const coursesData = await courseModel.find({
            _id: { $in: purchasedCourseIds }
        });

        res.json({
            purchases,
            coursesData
        });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({
            message: "Error fetching your purchases"
        });
    }
});

module.exports = {
    userRouter: userRouter
}