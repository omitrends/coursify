const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db")
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    try {
        const userId = req.userId;
        const courseId = req.body.courseId;
        
        console.log("Purchase request:", { userId, courseId });
        
        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }
        
        // Check if course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        
        // Check if already purchased
        const existingPurchase = await purchaseModel.findOne({
            userId,
            courseId
        });
        
        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course"
            });
        }
        
        // Create purchase record
        await purchaseModel.create({
            userId,
            courseId
        });
        
        res.json({
            message: "You have successfully bought the course"
        });
    } catch (error) {
        console.error("Purchase error:", error);
        res.status(500).json({
            message: "Failed to purchase course",
            error: error.message
        });
    }
});

courseRouter.get("/preview", async function(req, res) {
    try {
        const courses = await courseModel.find({});
        res.json({
            courses
        });
    } catch (error) {
        console.error("Preview error:", error);
        res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message
        });
    }
});

module.exports = {
    courseRouter: courseRouter
}