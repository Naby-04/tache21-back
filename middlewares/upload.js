const multer = require("multer");
const storage = multer.memoryStorage();

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
module.exports = {upload}

module.exports = {upload};
