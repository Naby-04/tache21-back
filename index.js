const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const {errorHandler} = require("./middleware/errorMiddleware.js")
const usersRoutes = require("./routes/usersRoutes.js")

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", usersRoutes);

// Gestion des erreurs
app.use(errorHandler);


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log("PORT from .env:", process.env.PORT);

      console.log(`Server running on port ${process.env.PORT}`);
    });
  });