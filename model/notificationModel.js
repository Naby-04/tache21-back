const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recepteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rapport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rapport",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
