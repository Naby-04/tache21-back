const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const rapportSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true,
   },

   description:{
    type: String,
    required: true,
   },
   fileUrl: {
    type: String,
    required: true,
   },
   category : {
    type: String,
    required: true,
   },
   tags: {
    type: String,
   },
    user: {
        type: String,
        ref: "User",
        required: true,
    },

    _id: {
        type: String,
        default: uuidv4,
    }
}, {timestamps: true, _id: false});

module.exports = mongoose.model("Rapport", rapportSchema);

