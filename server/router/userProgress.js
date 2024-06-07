const express = require("express");
const UserProgress = require("../models/UserProgress");
const SuraqJauap = require("../models/SuraqJauap");
const User = require("../models/user");

const router = express.Router();

// Route to save user progress
router.post("/user/progress", async (req, res) => {
    const { username, quizId, level, score } = req.body;
    const passed = score >= 70; // 70% threshold

    console.log("Received data:", { username, quizId, level, score });

    try {
        const existingProgress = await UserProgress.findOne({ username, quizId, level });

        if (existingProgress) {
            console.log("Updating existing progress:", existingProgress);
            existingProgress.score = score;
            existingProgress.passed = passed;
            await existingProgress.save();
        } else {
            console.log("Creating new progress record with username:", username);
            const newUserProgress = new UserProgress({ username, quizId, level, score, passed });
            await newUserProgress.save();
        }

        // Determine next level
        let nextLevel = null;
        if (passed) {
            const nextQuiz = await SuraqJauap.findOne({ level: level + 1 });
            if (nextQuiz) {
                nextLevel = nextQuiz.level;
            }
        }

        console.log("Progress saved successfully, next level:", nextLevel);
        res.status(200).json({ message: "Progress saved successfully", passed, nextLevel });
    } catch (error) {
        console.error("Failed to save progress:", error);
        res.status(500).json({ message: "Failed to save progress", error: error.message });
    }
});

module.exports = router;
