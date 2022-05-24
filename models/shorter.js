const mongoose = require("mongoose");

const shorterSchema = mongoose.Schema({
    original_url: { type: String },
    short_url: { type: String },
});

const Shorter = mongoose.model("Shorter", shorterSchema);
module.exports = Shorter;