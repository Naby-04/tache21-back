const express = require("express");

const router = express.Router()

// const {protect, admin} = require("../middlewares/authMiddleware")
const {controllerDownload, getDownloads, getDownloadsUser , deleteDownload} = require("../controllers/downloadController");
const {protect} = require("../middlewares/authMiddleware")
// const {controllerDownload , getMyDownloads} = require("../controllers/downloadController");
const { uploadToCloucinary } = require("../middlewares/upload");

router.get("/:rapportId",protect, controllerDownload)
router.get("/all/rapport", getDownloads);
router.get("/all/userRapport", protect, getDownloadsUser);

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

// // Ensuite la route dynamique
// router.get("/:rapportId", protect, controllerDownload);



// module.exports = 
// router
