const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const rapportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  tags: {
    type: String,
  },
  publicId: {
    type: String,
  },

  type: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, { timestamps: true });



module.exports = mongoose.model("Rapport", rapportSchema);

