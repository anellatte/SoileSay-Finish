const express = require('express');
const router = express.Router();
const MaqalDrop = require('../models/MaqalDrop');
const User = require('../models/user');

// Add a maqal (admin only)
router.post('/add', async (req, res) => {
    const { username, sentence } = req.body;

    if (!username) {
        return res.status(401).json({ message: 'Username is required' });
    }

    try {
        const user = await User.findOne({ username });
        if (user && user.isAdmin) {
            const newMaqal = new MaqalDrop({ sentence });
            await newMaqal.save();
            res.status(201).json({ message: 'Maqal added successfully' });
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch all maqals
router.get('/', async (req, res) => {
    try {
        const maqals = await MaqalDrop.find().sort({ date: 1 }); // Sorted by date ascending
        res.status(200).json(maqals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
