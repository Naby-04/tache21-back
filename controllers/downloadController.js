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

const getDownloads = async (req, res) => {
  try {
    const downloads = await Download.find({}).populate("userId").populate("rapportId")
    res.status(200).json(downloads)
  } catch (error) {
    console.log("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

const getDownloadsUser = async (req, res) => {
  try {
    const download = await Download.find({userId: req.user.id}).populate("rapportId").populate("userId")
    res.status(200).json(download)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { controllerDownload, getDownloads, getDownloadsUser };
// const getMyDownloads = async (req, res) => {
//   try {
//     const userId = req.user?._id;

//     // Récupère les téléchargements de l'utilisateur et popule les rapports liés
//     const downloads = await Download.find({ userId }).populate("rapportId");

//     // Extrait les rapports téléchargés (rapportId contient le document Rapport)
//     const rapports = downloads.map(dl => ({
//       _id: dl.rapportId._id,
//       title: dl.rapportId.title,
//       description: dl.rapportId.description,
//       fileUrl: dl.rapportId.fileUrl,
//       createdAt: dl.rapportId.createdAt,
//     }));

//     res.status(200).json(rapports);
//   } catch (err) {
//     console.error("Erreur lors de la récupération des téléchargements :", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };






// const getDownloadCount = async (req, res) => {
//   try {
//     const count = await Download.countDocuments();
//     res.status(200).json({ totalDownloads: count });
//   } catch (error) {
//     console.error("Erreur lors du comptage des téléchargements :", error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };