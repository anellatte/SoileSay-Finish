const mongoose = require('mongoose');

const MaqalDropSchema = new mongoose.Schema({
    sentence: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const MaqalDrop = mongoose.models.MaqalDrop || mongoose.model('MaqalDrop', MaqalDropSchema);

module.exports = MaqalDrop;