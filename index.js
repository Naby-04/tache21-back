const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db")
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://back:back1234@cluster0.bbasbd8.mongodb.net/back?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });
  app.get("/", (req, res) => {
    res.send("hello saliou and baba nafina ...");
  })
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const connectDB = require("./config/db")
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://back:back1234@cluster0.bbasbd8.mongodb.net/back?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    app.listen(8080, () => {
      console.log(`Server running on port 8080}`);
    });
  });
  app.get("/", (req, res) => {
    res.send("Hello World!");
  })