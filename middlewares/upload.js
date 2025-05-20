// middlewares/multer.js
const multer = require("multer");
const path = require("path");
const cloudinary = require("../cloudinary")


//on definit ou sotcker le fichier et le nom

const storage = multer.memoryStorage();


// filtre des extensions autorisées
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = file.originalname.split('.').pop().toLowerCase();

  if (allowedExtensions.includes("." + ext)) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers Word et PDF sont autorisés."), false);
  }
};

const upload = multer({ storage, fileFilter });

console.log("Middleware multer chargé", upload)

module.exports = upload;
