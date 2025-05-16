const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db")
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoutes");
const rapportRoutes = require("./routes/Rapport");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Gestion des erreurs


// Routes
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);


//Import les routes app et get
app.use("/post", require("./routes/PostRoute"));



app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
  });

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log("PORT from .env:", process.env.PORT);

      console.log(`Server running on port ${process.env.PORT}`);
    });
  });
  