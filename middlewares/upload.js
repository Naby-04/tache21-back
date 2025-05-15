const multer = require("multer");
const path = require("path");

//on definit ou sotcker le fichier et le nom
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ici la destination s'appelle uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname; // ici on le nom du fichier en la rendant unique pour eviter les doublons
    cb(null, uniqueName);
  }
});

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

module.exports = upload;
