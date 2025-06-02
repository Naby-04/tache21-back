const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db.js");
const { upload } = require("./middlewares/upload.js");
const { errorHandler } = require("./middlewares/errorMiddleware.js");

const usersRoutes = require("./routes/usersRoutes.js");
const rapportRoutes = require("./routes/Rapport");
const downloadRoutes = require("./routes/downloadRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./sawgger");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Gestion des sockets
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`Utilisateur ${userId} connecté à une room`);
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

// Ajouter io à l’app pour le rendre accessible dans les routes
app.set("io", io);

// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);
app.use("/api/comments", commentRoutes);
app.use("/download", downloadRoutes);
app.use("/api/notifications", notificationRoutes);

// Test upload
app.post("/test-upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu" });
  }
  res.status(200).json({ message: "Fichier reçu avec succès" });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gestion d’erreurs
app.use(errorHandler);

// Démarrer le serveur
connectDB().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
