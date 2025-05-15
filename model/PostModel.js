const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  contenu: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
