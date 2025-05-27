const mongoose = require("mongoose");
const cloudinary = require("../cloudinary");

const Download = require("../model/dowloadModel");
const Rapport = require("../model/rapportModel");

const controllerDownload = async (req, res) => {
  try {
    const { rapportId } = req.params;
    const userId = req.user?._id; // Assure-toi que l'auth middleware remplit req.user

    // Vérifie la validité de l'ID du rapport
    if (!mongoose.Types.ObjectId.isValid(rapportId)) {
      return res.status(400).json({ message: "ID du rapport invalide" });
    }


    console.log("iD recu", rapportId)

    // Vérifie que le rapport existe
    const rapport = await Rapport.findById(rapportId);

    console.log("Rapport trouver", rapport)

    if (!rapport) {
      return res.status(404).json({ message: "Rapport introuvable" });
    }

       // ✅ Extraire le public_id depuis le fileUrl
    const getPublicIdFromUrl = (url) => {
        const parts = url.split("/");
        const fileName = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const publicIdWithExt = `${folder}/${fileName}`;
        return publicIdWithExt.replace(/\.[^/.]+$/, ""); // Supprime .pdf
    };

      const publicId = getPublicIdFromUrl(rapport.fileUrl); 
      
      if (!publicId) {
        return res.status(400).json({ message: "Fichier non uploadé ou erreur Cloudinary." });
      }

    const signedUrl = cloudinary.url(publicId, {
      secure: true,
      resource_type: "raw",
      sign_url: false,
      flags: "attachment" //pour forcer postman a lancer direct le telechargement
    })
    // Enregistre le téléchargement dans la base de données
    await Download.create({
      rapportId: rapport._id,
      userId,
    });

    return res.status(200).json({
      url: signedUrl,
      message: "Telecharger le fichier via ce lien"
    })


  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { controllerDownload };
