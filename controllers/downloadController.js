const mongoose = require("mongoose");

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

    // Vérifie que le rapport existe
    const rapport = await Rapport.findById(rapportId);
    if (!rapport) {
      return res.status(404).json({ message: "Rapport introuvable" });
    }

    // Vérifie que le fichier existe
    if (!rapport.file || !rapport.file.startsWith("http")) {
      return res.status(400).json({ message: "URL de fichier invalide" });
    }
    // Enregistre le téléchargement dans la base de données
    await Download.create({
      rapportId: rapport._id,
      userId,
    });

    return res.redirect(rapport.file);


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
    const download = await Download.find({userId: req.user.id})
    .populate({
      path: "rapportId",
      populate: {
        path: "userId", 
        select: "prenom nom email",
      },
    })
    .populate("userId")
    res.status(200).json(download)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// controllers/downloadController.js


const deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Assure-toi que ton middleware d'auth ajoute req.user

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({ message: "Téléchargement introuvable" });
    }

    // Optionnel : s'assurer que l'utilisateur est bien le propriétaire
    if (download.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await Download.findByIdAndDelete(id);

    res.status(200).json({ message: "Téléchargement supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression téléchargement :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




module.exports = { controllerDownload, getDownloads, getDownloadsUser , deleteDownload};
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