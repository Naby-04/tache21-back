const multer = require("multer");
const path = require("path");
const cloudinary = require("../cloudinary")


//on definit ou sotcker le fichier et le nom

const storage = multer.memoryStorage();


// filtre des extensions autorisées
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase(); // on initialise l'extension

  if (allowedExtensions.includes(ext)) {
    cb(null, true); // on accepte le fichier 
  } else {
    cb(new Error("Seuls les fichiers Word et PDF sont autorisés."), false);
  }
};


// cration de l'objet multer avec sa config
const upload = multer({ storage, fileFilter });

console.log("Middleware multer chargé", upload)

module.exports = upload;
