const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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
   user: {
       type: String,
       ref: "User",
       required: true,
   },

   _id: {
       type: String,
       default: uuidv4,
   }
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
}, {timestamps: true, _id: false});


module.exports = mongoose.model("Rapport", rapportSchema);

