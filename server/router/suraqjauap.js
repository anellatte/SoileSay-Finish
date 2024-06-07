const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const { checkAdmin } = require("../middleware/checkAdmin");
const SuraqJauap = require("../models/SuraqJauap");

// Get levels for the current user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const user = req.user;  // Assume user is attached to req in authenticateUser middleware
        // Fetch levels based on user progress
        const levels = await SuraqJauap.find({ level: { $lte: user.currentLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels" });
    }
});

// Create a new level (admin)
router.post("/", authenticateUser, checkAdmin, async (req, res) => {
    try {
        const { text, level, questions } = req.body;
        const newSuraqJauap = new SuraqJauap({ text, level, questions });
        const savedSuraqJauap = await newSuraqJauap.save();
        res.status(201).json(savedSuraqJauap);
    } catch (error) {
        res.status(400).json({ message: "Error creating level" });
    }
});

// Get all levels (admin)
router.get("/all", authenticateUser, checkAdmin, async (req, res) => {
    try {
        const levels = await SuraqJauap.find().sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching levels" });
    }
});

// Update a level (admin)
router.put("/:id", authenticateUser, checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { text, level, questions } = req.body;
        const updatedSuraqJauap = await SuraqJauap.findByIdAndUpdate(id, { text, level, questions }, { new: true });
        if (!updatedSuraqJauap) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.json(updatedSuraqJauap);
    } catch (error) {
        res.status(400).json({ message: "Error updating level" });
    }
});

// Delete a level (admin)
router.delete("/:id", authenticateUser, checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSuraqJauap = await SuraqJauap.findByIdAndDelete(id);
        if (!deletedSuraqJauap) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.json({ message: "Level deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting level" });
    }
});
router.get("/:id", authenticateUser, checkAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const suraqJauap = await SuraqJauap.findById(id);
        if (!suraqJauap) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.json(suraqJauap);
    } catch (error) {
        res.status(500).json({ message: "Error fetching level" });
    }
});
module.exports = router;
