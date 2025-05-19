const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");
const { errorHandler } = require("./middlewares/errorMiddleware.js");

const usersRoutes = require("./routes/usersRoutes.js");
const rapportRoutes = require("./routes/Rapport");
const commentRoutes = require("./routes/commentRoutes.js");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./sawgger");

dotenv.config();

const app = express();

// ✅ 1. CORS
app.use(cors({
  origin: "http://localhost:5173", // ou ton domaine frontend déployé
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Routes API
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);
app.use("/api/comments", commentRoutes);

// ✅ 4. Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ 5. (Optionnel) Dossier statique local
// ❌ Tu peux supprimer cette ligne si tu utilises Cloudinary maintenant
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 6. Gestion des erreurs
app.use(errorHandler);

// ✅ 7. Démarrage serveur
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
  });
});
