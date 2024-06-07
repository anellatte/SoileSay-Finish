const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const authenticateUser = require('../middleware/authenticateUser');
const Talda = require('../models/talda');
const router = express.Router();
const SuraqJauap = require('../models/SuraqJauap')



// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('avatar');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Incorrect media type. Images only!');
    }
}
// Route to handle profile update
router.post('/updateProfile', authenticateUser, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        const { username, email } = req.body;
        const avatar = req.file ? `uploads/${req.file.filename}` : req.user.avatar;

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            user.username = username || user.username;
            user.email = email || user.email;
            if (avatar) user.avatar = avatar;

            await user.save();
            res.json({
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            });
        } catch (error) {
            res.status(500).json({ msg: "An error occurred while updating the profile" });
        }
    });
});

// Route to get profile information
router.get('/', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json({
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            taldaLevel: user.taldaLevel,
            SJlevel: user.SJLevel,
            maqalLevel: user.maqalLevel
        });
    } catch (error) {
        res.status(500).json({ msg: "An error occurred while retrieving the profile" });
    }
});

//TAlDA
// Route to get current Talda level
router.get('/current', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const talda = await Talda.findOne({ level: user.taldaLevel });
        if (!talda) {
            return res.status(404).json({ message: 'Current Talda level not found' });
        }
        res.json(talda);
    } catch (error) {
        console.error('Error fetching current Talda level:', error);
        res.status(500).json({ message: "Error fetching current Talda level" });
    }
});


// Update the user's talda level
router.post('/updateLevel', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { level } = req.body;

        if (level !== user.taldaLevel) {
            return res.json({ message: 'You can only advance from your current highest level', taldaLevel: user.taldaLevel });
        }

        const nextLevel = user.taldaLevel + 1;
        const nextLevelExists = await Talda.exists({ level: nextLevel });

        if (!nextLevelExists) {
            return res.json({ message: 'No more levels', taldaLevel: user.taldaLevel });
        }

        user.taldaLevel = nextLevel;
        await user.save();
        res.json({ taldaLevel: user.taldaLevel });
    } catch (error) {
        res.status(500).json({ message: 'Error updating talda level', error: error.message });
    }
});


// Get levels for the current user
router.get('/level', authenticateUser, async (req, res) => {
    const { level } = req.query;
    try {
        const talda = await Talda.findOne({ level: parseInt(level) });
        if (!talda) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.json(talda);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching level' });
    }
});

// Get all completed levels for the current user
router.get('/completed', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const levels = await Talda.find({ level: { $lte: user.taldaLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed levels' });
    }
});

//SuraqJauap

// Get specific SuraqJauap level for the current user

router.get('/sjcurrent', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const sj = await SuraqJauap.findOne({ level: user.SJLevel });
        if (!sj) {
            return res.status(404).json({ message: 'Current SuraqJauap level not found' });
        }
        res.json(sj);
    } catch (error) {
        console.error('Error fetching current SuraqJauap level:', error);
        res.status(500).json({ message: "Error fetching current SuraqJauap level" });
    }
});

// Get specific SuraqJauap level for the current user
router.get('/sjlevel', authenticateUser, async (req, res) => {
    const level = parseInt(req.query.level, 10);
    if (isNaN(level)) {
        return res.status(400).json({ message: 'Invalid level parameter' });
    }

    try {
        const sj = await SuraqJauap.findOne({ level: level });
        if (!sj) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.json(sj);
    } catch (error) {
        console.error('Error fetching SuraqJauap level:', error);
        res.status(500).json({ message: 'Error fetching SuraqJauap level' });
    }
});

// Get all completed SuraqJauap levels for the current user
router.get('/sjcompleted', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const levels = await SuraqJauap.find({ level: { $lte: user.SJLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        console.error('Error fetching completed SuraqJauap levels:', error);
        res.status(500).json({ message: 'Error fetching completed SuraqJauap levels' });
    }
});

// Update the user's SuraqJauap level
router.post('/sjupdateLevel', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { level } = req.body;

        if (level !== user.SJLevel) {
            return res.json({ message: 'You can only advance from your current highest level', SJLevel: user.SJLevel });
        }

        const nextLevel = user.SJLevel + 1;
        const nextLevelExists = await SuraqJauap.exists({ level: nextLevel });

        if (!nextLevelExists) {
            return res.json({ message: 'No more levels', SJLevel: user.SJLevel });
        }

        user.SJLevel = nextLevel;
        await user.save();
        res.json({ SJLevel: user.SJLevel });
    } catch (error) {
        console.error('Error updating SuraqJauap level:', error);
        res.status(500).json({ message: 'Error updating SuraqJauap level', error: error.message });
    }
});

module.exports = router;