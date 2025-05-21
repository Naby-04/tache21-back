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

    const comments = await Comment.find({ rapport: rapportId })
      .populate("user", "prenom email") // pour voir les infos de l’auteur => interessant a retenir
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



module.exports = router