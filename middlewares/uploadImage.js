// middlewares/uploadImage.js
const multer = require("multer");
const path = require("path");

// Utilisation de la mémoire comme stockage temporaire
const storage = multer.memoryStorage();

// Autoriser uniquement les images
const imageFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images (jpg, jpeg, png, gif) sont autorisées."), false);
  }
};

const uploadImage = multer({ storage, fileFilter: imageFilter });

module.exports = uploadImage;
