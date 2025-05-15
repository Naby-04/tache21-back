const mongoose = require("mongoose");

const dowloadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    rapportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rapport",
        required: true,
    },

    dowloadAt: {
        type: Date,
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model("Dowload", dowloadSchema);
