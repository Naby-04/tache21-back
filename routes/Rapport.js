const express = require("express")
const { createRapport, deleteRapport, updateRapport, getRapport, getOneRapport } = require("../controllers/rapportController")
const upload = require("../middlewares/upload")
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Rapport
 *   description: API de gestion des rapports de mémoire
 */

/**
 * @swagger
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
 *         auteur:
 *           type: string
 *         description:
 *           type: string
 *         fileUrl:
 *           type: string
 *           format: binary
 *         date:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /rapport/create:
 *   post:
 *     summary: Créer un nouveau rapport
 *     tags: [Rapports]
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
 *               category: 
 *                  type: string
 *               description:
 *                 type: string
 *               fileUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 */

/**
 * @swagger
 * /rapport/all:
 *   get:
 *     summary: Récupérer tous les rapports
 *     tags: [Rapports]
 *     responses:
 *       200:
 *         description: Liste de tous les rapports
 */

/**
 * @swagger
 * /rapport/one/{id}:
 *   get:
 *     summary: Obtenir un rapport spécifique par ID
 *     tags: [Rapports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport récupéré avec succès
 *       404:
 *         description: Rapport non trouvé
 */

/**
 * @swagger
 * /rapport/{id}:
 *   put:
 *     summary: Mettre à jour un rapport existant
 *     tags: [Rapports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rapport'
 *     responses:
 *       200:
 *         description: Rapport mis à jour avec succès
 */

/**
 * @swagger
 * /rapport/{id}:
 *   delete:
 *     summary: Supprimer un rapport
 *     tags: [Rapports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport à supprimer
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       404:
 *         description: Rapport non trouvé
 */


router.post("/create", upload.single("fileUrl"), createRapport)
router.get("/all", getRapport)
router.delete("/:id", deleteRapport)
router.put("/:id", updateRapport)
router.get("/one/:id", getOneRapport)

module.exports = router

//le upload.single("fichier") permet de recuperer le fichier , LE STOCK DANS uploads avec un nom unique et ajoute un obbet req.file. Ainsi la createRapport pour stocker le req.file.path dans le fileUrl