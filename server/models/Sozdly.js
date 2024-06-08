const mongoose = require('mongoose');

const sozdlySchema = new mongoose.Schema({
    word: { type: String, required: true },
    level: { type: Number, required: true }
});

const Sozdly = mongoose.models.Sozdly || mongoose.model('Sozdly', sozdlySchema);

module.exports = Sozdly;