const path = require("path");
const fs = require("fs");
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
    const filePath = path.resolve(rapport.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier non trouvé sur le serveur" });
    }

    // Enregistre le téléchargement dans la base de données
    await Download.create({
      rapportId: rapport._id,
      userId,
    });

    // Sert le fichier au client
    return res.download(filePath, rapport.titre || "rapport.pdf", (err) => {
      if (err) {
        console.error("Erreur lors du téléchargement :", err);
        return res.status(500).json({ message: "Erreur de téléchargement" });
      }
    });

  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { controllerDownload };
