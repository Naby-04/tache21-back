const express = require("express");

const router = express.Router()

const {protect, admin} = require("../middlewares/authMiddleware")
const {controllerDownload, getDownloads, getDownloadsUser} = require("../controllers/downloadController");

router.get("/:rapportId",protect, controllerDownload)

// Recuperation des downloads
router.get("/all/rapport", admin, protect, getDownloads)
router.get("/all/userRapport" ,protect, getDownloadsUser)


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