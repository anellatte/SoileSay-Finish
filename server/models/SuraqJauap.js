// models/SuraqJauap.js

const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define option schema
const optionSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    },
});

// Define question schema
const questionSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    options: [optionSchema],
});

// Define SuraqJauap schema
const SuraqJauapSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    questions: [questionSchema],
});

const SuraqJauap = mongoose.model('SuraqJauap', SuraqJauapSchema);

module.exports = SuraqJauap;
