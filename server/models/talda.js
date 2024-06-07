// models/Talda.js
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    word: String,
    type: {
        type: String,
        enum: ['Баяндауыш', 'Бастауыш', 'Толықтауыш', 'Пысықтауыш', 'Анықтауыш']
    },
});

const taldaSchema = new mongoose.Schema({
    text: { type: String, required: true },
    analysis: [analysisSchema],
    level: { type: Number, required: true }
});

const Talda = mongoose.model('Talda', taldaSchema);

module.exports = Talda;
