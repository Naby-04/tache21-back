const mongoose = require("mongoose");

const rapportSchema = new mongoose.Schema({
    rapportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rapport",
    },
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
   type: {
    type: String,
   },

    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
}, {timestamps: true});

module.exports = mongoose.model("Rapport", rapportSchema);

