const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const rapportRoutes = require("./routes/Rapport");
app.use("/rapport", rapportRoutes);


connectDB()
.then(() => {
    app.listen(process.env.PORT,"0.0.0.0", () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });