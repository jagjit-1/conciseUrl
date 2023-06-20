const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    longUrl: { type: String, required: true, trim: true },
    urlHash: { type: String, required: true, trim: true, unique: true },
    expiresAt: {
        type: Date,
        expires: 0
    },
    hits: {
        type: Number,
        default: 0
    },
    createdBy: String,
    updatedBy: String

}, { timeStamps: true, collection: "url_mapping" });

module.exports = mongoose.model("UrlMapping", schema);