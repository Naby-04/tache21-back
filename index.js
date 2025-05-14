const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");



const rapportRoute = require("./routes/Rapport")


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });