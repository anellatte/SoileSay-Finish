const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const authenticateUser = require('../middleware/authenticateUser');
const Talda = require('../models/talda');
const SuraqJauap = require('../models/SuraqJauap');
const Sozdly = require('../models/sozdly');
const router = express.Router();

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
    console.log('Fetching profile for user:', req.user._id);
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
            maqalLevel: user.maqalLevel,
            sozdlyLevel: user.sozdlyLevel
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ msg: "An error occurred while retrieving the profile" });
    }
});

// Talda
router.get('/current', authenticateUser, async (req, res) => {
    console.log('Fetching current Talda level for user:', req.user._id);
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

router.post('/updateLevel', authenticateUser, async (req, res) => {
    console.log('Updating Talda level for user:', req.user._id);
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
        console.error('Error updating Talda level:', error);
        res.status(500).json({ message: 'Error updating talda level', error: error.message });
    }
});

router.get('/level', authenticateUser, async (req, res) => {
    console.log('Fetching Talda level:', req.query.level);
    const { level } = req.query;
    try {
        const talda = await Talda.findOne({ level: parseInt(level) });
        if (!talda) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.json(talda);
    } catch (error) {
        console.error('Error fetching Talda level:', error);
        res.status(500).json({ message: 'Error fetching level' });
    }
});

router.get('/completed', authenticateUser, async (req, res) => {
    console.log('Fetching completed Talda levels for user:', req.user._id);
    try {
        const user = req.user;
        const levels = await Talda.find({ level: { $lte: user.taldaLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        console.error('Error fetching completed Talda levels:', error);
        res.status(500).json({ message: 'Error fetching completed levels' });
    }
});

// SuraqJauap
router.get('/sjcurrent', authenticateUser, async (req, res) => {
    console.log('Fetching current SuraqJauap level for user:', req.user._id);
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

router.get('/sjlevel', authenticateUser, async (req, res) => {
    console.log('Fetching SuraqJauap level:', req.query.level);
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

router.get('/sjcompleted', authenticateUser, async (req, res) => {
    console.log('Fetching completed SuraqJauap levels for user:', req.user._id);
    try {
        const user = req.user;
        const levels = await SuraqJauap.find({ level: { $lte: user.SJLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        console.error('Error fetching completed SuraqJauap levels:', error);
        res.status(500).json({ message: 'Error fetching completed SuraqJauap levels' });
    }
});

router.post('/sjupdateLevel', authenticateUser, async (req, res) => {
    console.log('Updating SuraqJauap level for user:', req.user._id);
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

// Sozdly
router.get('/sozdlycurrent', authenticateUser, async (req, res) => {
    console.log('Fetching current Sozdly level for user:', req.user._id);
    try {
        const user = req.user;
        const sozdly = await Sozdly.findOne({ level: user.sozdlyLevel });
        if (!sozdly) {
            return res.status(404).json({ message: 'Current Sozdly level not found' });
        }
        res.json(sozdly);
    } catch (error) {
        console.error('Error fetching current Sozdly level:', error);
        res.status(500).json({ message: "Error fetching current Sozdly level" });
    }
});

router.get('/sozdlylevel', authenticateUser, async (req, res) => {
    console.log('Fetching Sozdly level:', req.query.level);
    const level = parseInt(req.query.level, 10);
    if (isNaN(level)) {
        return res.status(400).json({ message: 'Invalid level parameter' });
    }

    try {
        const sozdly = await Sozdly.findOne({ level: level });
        if (!sozdly) {
            return res.status(404).json({ message: 'Level not found' });
        }
        res.json(sozdly);
    } catch (error) {
        console.error('Error fetching Sozdly level:', error);
        res.status(500).json({ message: 'Error fetching Sozdly level' });
    }
});

router.get('/sozdlycompleted', authenticateUser, async (req, res) => {
    console.log('Fetching completed Sozdly levels for user:', req.user._id);
    try {
        const user = req.user;
        const levels = await Sozdly.find({ level: { $lte: user.sozdlyLevel } }).sort({ level: -1 });
        res.json(levels);
    } catch (error) {
        console.error('Error fetching completed Sozdly levels:', error);
        res.status(500).json({ message: 'Error fetching completed Sozdly levels' });
    }
});

router.post('/sozdlyupdateLevel', authenticateUser, async (req, res) => {
    console.log('Updating Sozdly level for user:', req.user._id);
    try {
        const user = req.user;
        const { level } = req.body;

        if (level !== user.sozdlyLevel) {
            return res.json({ message: 'You can only advance from your current highest level', sozdlyLevel: user.sozdlyLevel });
        }

        const nextLevel = user.sozdlyLevel + 1;
        const nextLevelExists = await Sozdly.exists({ level: nextLevel });

        if (!nextLevelExists) {
            return res.json({ message: 'No more levels', sozdlyLevel: user.sozdlyLevel });
        }

        user.sozdlyLevel = nextLevel;
        await user.save();
        res.json({ sozdlyLevel: user.sozdlyLevel });
    } catch (error) {
        console.error('Error updating Sozdly level:', error);
        res.status(500).json({ message: 'Error updating Sozdly level', error: error.message });
    }
});

module.exports = router;
