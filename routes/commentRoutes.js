const express = require('express')
const router = express.Router()
const Comment = require("../model/commentsModel")
const Rapport = require("../model/rapportModel")
const { protect } = require("../middlewares/authMiddleware")

router.post("/:rapportId", protect, async (req, res) => {
    const { comment } = req.body
    const { rapportId } = req.params

    if(!comment){
        return res.status(400).json({message: "Le commentaire est requis"})
    }

    try {
        const rapport = await Rapport.findById(rapportId)
        if(!rapport) {
            return res.status(404).json({message: "Rapport introuvable"})
        }

        const newComment = await Comment.create({
            comment,
            user: req.user._id,
            rapport: rapportId,
        })

        res.status(201).json(newComment)
    } catch (error) {
        console.error("Erreu lors de la creation du comentaire", error)
        res.status(500).json({message: "Erreur"})
    }
})

// Récupérer tous les commentaires d’un rapport
router.get("/:rapportId", async (req, res) => {
  const { rapportId } = req.params;

  try {
    const rapport = await Rapport.findById(rapportId);
    if (!rapport) {
      return res.status(404).json({ message: "Rapport introuvable" });
    }

    const comments = await Comment.find({ rapport: new mongoose.Types.ObjectId(rapportId) })
      .populate("user", "prenom email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un commentaire (auteur ou admin uniquement)
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Commentaire introuvable" });
    }

    // Vérifie que c'est l'auteur OU un admin
    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Non autorisé à supprimer ce commentaire" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression commentaire :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




module.exports = router