const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);