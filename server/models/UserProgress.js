const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
    username: { type: String, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuraqJauap', required: true },
    level: { type: Number, required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true }
});

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = UserProgress;
