const mongoose = require("mongoose");   

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rapport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rapport",
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);