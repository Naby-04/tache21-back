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

const uploadToCloudinary = async ( req, res, next) => {
  if(!req.file) return res.status(400).json({msg: "Aucun fichier disponible"})

    try {
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(fileStr, {
          folder : "uploads",
          resource_type: "raw",
          access_mode: "public",
          public_id: `${Date.now()}_${path.parse(req.file.originalname).name}`,
          overwrite: false
        })
        console.log("Public Id :", result.public_id)

        req.file.cloudinaryData = result
        console.log("result :", result)

        next()
    } catch(error) {
      console.error('Erreur Cloudinary:', error);
    return res.status(500).json({ message: 'Échec de l\'upload Cloudinary', error: error.message })
    }
}

console.log("Middleware multer chargé", upload)

module.exports = {upload, uploadToCloudinary};
