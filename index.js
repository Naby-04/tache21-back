const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");

const { errorHandler } = require("./middlewares/errorMiddleware.js");
const usersRoutes = require("./routes/usersRoutes.js");
const rapportRoutes = require("./routes/Rapport");
const downloadRoutes = require("./routes/downloadRoutes");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./sawgger");

const commentRoutes = require('./routes/commentRoutes.js')


dotenv.config();
const app = express();

// ✅ Middleware de base
app.use(cors({
  origin: "*",
  // origin: "https://senrapport.netlify.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);
app.use("/api/comments", commentRoutes)

// ✅ Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Gestion d’erreurs
app.use(errorHandler);

// routesSwagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ✅ 6. Connexion & démarrage serveur
connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });


