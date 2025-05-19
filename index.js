const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const {errorHandler} = require("./middlewares/errorMiddleware.js")
const usersRoutes = require("./routes/usersRoutes.js")
const rapportRoutes = require("./routes/Rapport.js");

// swagger module
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./sawgger");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Gestion des erreurs
app.use(errorHandler);

// Routes
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);

// routesSwagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });

