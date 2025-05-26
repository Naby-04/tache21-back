const express = require("express")
const { createRapport,
  getAllRapports,
  getRapportById,
  deleteRapport,
  updateRapport,
  getUserRapports,
  deleteUserRapport,
  updateUserRapport,} = require("../controllers/rapportController")

const {upload} = require("../middlewares/upload")
const {protect, admin} = require("../middlewares/authMiddleware")
const { getDownloads, getDownloadsUser } = require("../controllers/downloadController")

const router = express.Router()

router.get("/all", getAllRapports)
router.post("/create", protect, upload.single("file"), createRapport)
router.delete("/:id", protect, deleteRapport)
router.put("/:id", protect, updateRapport)
router.get("/one/:id", protect, getRapportById)

router.get("/getMyRapport",protect, getUserRapports)
router.delete("/deleteMyRapport",protect, deleteUserRapport)
router.post("/updateMyRapport",protect, updateUserRapport)


/**
 * @swagger
 * tags:
 *   name: Rapport
 *   description: API de gestion des rapports de mémoire
 *
 * components:
 *   schemas:
 *     Rapport:
 *       type: object
 *       required:
 *         - titre
 *         - auteur
 *         - fileUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: ID généré automatiquement
 *         titre:
 *           type: string
 *           description: Titre du rapport
 *         auteur:
 *           type: string
 *           description: Auteur du rapport
 *         description:
 *           type: string
 *           description: Description du rapport
 *         fileUrl:
 *           type: string
 *           format: binary
 *           description: Chemin vers le fichier uploadé
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date de création du rapport
 *
 * /rapport/create:
 *   post:
 *     summary: Créer un nouveau rapport avec upload de fichier
 *     tags: [Rapport]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du rapport
 *               category:
 *                 type: string
 *                 description: Catégorie du rapport
 *               description:
 *                 type: string
 *                 description: Description du rapport
 *               fileUrl:
 *                 type: string
 *                 format: binary
 *                 description: Fichier du rapport à uploader
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *
 * /rapport/all:
 *   get:
 *     summary: Récupérer la liste de tous les rapports
 *     tags: [Rapport]
 *     responses:
 *       200:
 *         description: Liste de rapports retournée avec succès
 *
 * /rapport/one/{id}:
 *   get:
 *     summary: Obtenir un rapport spécifique par son ID
 *     tags: [Rapport]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du rapport à récupérer
 *     responses:
 *       200:
 *         description: Rapport récupéré avec succès
 *       404:
 *         description: Rapport non trouvé
 *
 * /rapport/{id}:
 *   put:
 *     summary: Mettre à jour un rapport existant
 *     tags: [Rapport]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du rapport à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rapport'
 *     responses:
 *       200:
 *         description: Rapport mis à jour avec succès
 *       404:
 *         description: Rapport non trouvé
 *
 * /rapport/delete/{id}:
 *   delete:
 *     summary: Supprimer un rapport par son ID
 *     tags: [Rapport]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du rapport à supprimer
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       404:
 *         description: Rapport non trouvé
 */




module.exports = router

//le upload.single("fichier") permet de recuperer le fichier , LE STOCK DANS uploads avec un nom unique et ajoute un obbet req.file. Ainsi la createRapport pour stocker le req.file.path dans le fileUrl