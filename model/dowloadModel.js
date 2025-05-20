// models/downloadModel.js
const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  rapportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rapport',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloadAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Download', downloadSchema);
