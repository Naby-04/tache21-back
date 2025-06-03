const express = require("express");
const Download = require("../model/dowloadModel");
const router = express.Router()

// const {protect, admin} = require("../middlewares/authMiddleware")
const {controllerDownload, getDownloads, getDownloadsUser , deleteDownload} = require("../controllers/downloadController");
const {protect} = require("../middlewares/authMiddleware")
// const {controllerDownload , getMyDownloads} = require("../controllers/downloadController");
const { uploadToCloucinary } = require("../middlewares/upload");

router.get("/top/downloaded", async (req, res) => {
    // console.log("Route /top/downloaded appelée !");
  try {
    const topDownloads = await Download.aggregate([
      {
        $group: {
          _id: "$rapportId",
          totalDownloads: { $sum: 1 }
        }
      },
      {
        $match: {
          totalDownloads: { $gt: 5 } // facultatif : filtre les rapports avec plus de 5 téléchargements
        }
      },
      {
        $sort: { totalDownloads: -1 }
      },
      {
        $lookup: {
          from: "rapports", // Nom exact de la collection MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "rapport"
        }
      },
      {
        $unwind: "$rapport"
      },
      {
        $project: {
          _id: 0,
          rapport: 1,
          totalDownloads: 1
        }
      }
    ]);

    res.status(200).json(topDownloads);
  } catch (error) {
    console.error("Erreur récupération top téléchargements :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:rapportId",protect, controllerDownload)
router.get("/all/rapport", getDownloads);
router.get("/all/userRapport", protect, getDownloadsUser);
// Ex: routes/downloadRoutes.js
router.delete('/:id', protect, deleteDownload);




// Commentaires swagger
/**
 * @swagger
 * /api/downloads/all/rapport:
 *   get:
 *     summary: Récupérer tous les téléchargements
 *     description: Cette route permet de récupérer la liste de tous les téléchargements effectués, avec les informations associées aux utilisateurs et aux rapports.
 *     tags: [Téléchargements]
 *     responses:
 *       200:
 *         description: Liste des téléchargements récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Download'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /all/userRapport:
 *   get:
 *     summary: Récupérer tous les rapports téléchargés par l'utilisateur authentifié
 *     tags: [Téléchargements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des téléchargements de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   rapportId:
 *                     $ref: '#/components/schemas/Rapport'
 *                   userId:
 *                     $ref: '#/components/schemas/User'
 *                   downloadAt:
*/

module.exports = router



// const {controllerDownload, getDownloads, getDownloadsUser, getDownloadCount} = require("../controllers/downloadController");

// // Mettez les routes spécifiques d'abord
// router.get("/count/all", protect, admin, getDownloadCount);
// router.get("/all/rapport", protect, admin, getDownloads);
// router.get("/all/userRapport", protect, getDownloadsUser);

// // Ensuite la route dynamique
// router.get("/:rapportId", protect, controllerDownload);



// module.exports = 
// router
