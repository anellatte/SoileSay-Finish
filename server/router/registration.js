const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    const regex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

router.get("/", (req, res) => {
    res.send("Welcome to the registration API");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login for email: ${email}`); // Log email

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            console.log(`User found: ${user}`); // Log user
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'qolshatyr', { expiresIn: '1h' });
                console.log('Token generated:', token); // Log the token generated
                res.json({ status: "exist", username: user.username, isAdmin: user.isAdmin, token });
            } else {
                console.log('Incorrect password'); // Log incorrect password
                res.json({ status: "error", message: "Incorrect password" });
            }
        } else {
            console.log('Email not registered'); // Log email not registered
            res.json({ status: "error", message: "Email not registered" });
        }
    } catch (e) {
        console.error(e);
        res.json({ status: "error", message: "An error occurred during login" });
    }
});

router.post("/signup", async (req, res) => {
    const { email, password, username } = req.body;

    if (!validateEmail(email)) {
        res.json({ status: "error", message: "Invalid email format" });
        return;
    }

    if (!validatePassword(password)) {
        res.json({ status: "error", message: "Weak password" });
        return;
    }

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            res.json({ status: "error", message: "Email already exists" });
        } else {
            const newUser = new User({
                email: email,
                password: password,
                username: username,
                taldaLevel: 1 // Initialize taldaLevel to 1 for new users
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, 'qolshatyr', { expiresIn: '1h' });
            res.json({ status: "success", message: "User registered successfully", token });
        }
    } catch (e) {
        console.error(e);
        res.json({ status: "error", message: "An error occurred during signup" });
    }
});

// Example protected route to update user profile
router.put("/profile", authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const { username, avatar } = req.body;

        user.username = username || user.username;
        user.avatar = avatar || user.avatar;

        await user.save();
        res.json({ status: "success", message: "Profile updated successfully", user });
    } catch (e) {
        console.error(e);
        res.json({ status: "error", message: "An error occurred while updating profile" });
    }
});

module.exports = router;
