const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");

const { errorHandler } = require("./middlewares/errorMiddleware.js");
const usersRoutes = require("./routes/usersRoutes.js");
const rapportRoutes = require("./routes/Rapport");
const downloadRoutes = require("./routes/downloadRoutes");
const path = require("path");


// swagger module
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./sawgger");

dotenv.config();
const app = express();

// ✅ 1. CORS en premier !
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ 2. JSON + urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Routes API
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);
app.use("/", downloadRoutes)


// ✅ 4. Fichiers statiques : après les routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 5. Gestion des erreurs
app.use(errorHandler);

// ✅ 6. Connexion & démarrage serveur
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
});

// routesSwagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });


