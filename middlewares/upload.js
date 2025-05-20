const multer = require("multer");
const path = require("path");
const cloudinary = require("../cloudinary")
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//on definit ou sotcker le fichier et le nom

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
    resource_type: "auto",
    public_id: (req, file) => {
      const original = file.originalname.replace(/\.[^/.]+$/, ""); // supprime l’extension
      const cleaned = original.trim().replace(/\s+/g, "_"); // supprime les espaces
      return `${Date.now()}_${cleaned}`; // ex : "1716209338_mon_fichier"
    },
  },
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

console.log("Middleware multer chargé", upload)

module.exports = upload;
