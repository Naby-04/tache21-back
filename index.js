const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db")
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


//Import les routes app et get
app.use("/post", require("./routes/PostRoute"));



app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
  });

mongoose.connect("mongodb+srv://back:back1234@cluster0.bbasbd8.mongodb.net/back?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });
  