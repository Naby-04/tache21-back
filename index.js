const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const connectDB = require("./config/db")
const mongoose = require("mongoose");


const rapportRoute = require("./routes/Rapport")


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONG_URL)  
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port 8080`);
    });
  });


app.get("/", (req, res) => {
    res.send("Hello World!");
  })

  app.use("/api", rapportRoute)