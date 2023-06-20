const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    counterName: { type: String, required: true, trim: true, unique: true },
    counterValue: { type: Number, required: true, default: 0 },
    createdBy: { type: String, required: true, trim: true },
    updatedBy: { type: String, required: true, trim: true }

}, { timeStamps: true, collection: "counters" });

module.exports = mongoose.model("Counters", schema);