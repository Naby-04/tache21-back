const express = require("express");
const router = express.Router();
const Notification = require("../model/notificationModel");
const { protect } = require("../middlewares/authMiddleware");

// Récupérer toutes les notifications pour un utilisateur
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recepteur: req.user._id })
      .populate("messager", "prenom email photo")
      .populate("rapport", "title") // ou autre champ pertinent
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur récupération des notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Marquer une notification comme lue
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    if (notification.recepteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marquée comme lue" });
  } catch (error) {
    console.error("Erreur lors du marquage de notification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
