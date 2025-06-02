const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io")
const http = require("http")
const connectDB = require("./config/db.js");
const {upload} = require("./middlewares/upload.js");

const { errorHandler } = require("./middlewares/errorMiddleware.js");

const usersRoutes = require("./routes/usersRoutes.js");
const rapportRoutes = require("./routes/Rapport");
const downloadRoutes = require("./routes/downloadRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./sawgger");

dotenv.config();

const app = express();
const server = http.createServer(app)


// ✅ Middleware de base
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// initialisation de io socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// on declare l'etat connection et la notif a envoyer
io.on("connection", (socket) => {
  socket.on("connect", (msg) => {
    io.emit("connect", msg)
  })
})

app.set("io", io)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/users", usersRoutes);
app.use("/rapport", rapportRoutes);
app.use("/api/comments", commentRoutes)
app.use("/download", downloadRoutes)

app.post("/test-upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu" });
  }
})


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


