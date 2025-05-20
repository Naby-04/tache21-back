const express = require("express")
const { createRapport,
        getAllRapports,
        getRapportById,
        deleteRapport,
        updateRapport,
        getUserRapports,
        deleteUserRapport,
        updateUserRapport 
    } = require("../controllers/rapportController")

const upload = require("../middlewares/upload")
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router()


router.post("/test-upload", upload.single("file"), (req, res) => {
  console.log("✅ req.body:", req.body);
  console.log("✅ req.file:", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu" });
  }
  return res.json({ message: "Fichier reçu avec succès", file: req.file });
});
router.post("/create",protect, upload.single("file"), createRapport)
router.get("/all", getAllRapports)
router.delete("/:id", deleteRapport)
router.put("/:id", updateRapport)
router.get("/one/:id", getRapportById)

router.get("/getMyRapport",protect, getUserRapports)
router.delete("/deleteMyRapport/:id",protect, deleteUserRapport)
router.put("/updateMyRapport/:id",protect, updateUserRapport)


module.exports = router


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
 *
 * /rapport/getMyRapport:
 *   get:
 *     summary: Récupérer tous les rapports de l'utilisateur connecté
 *     tags: [Rapport]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rapports de l'utilisateur retournée avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *
 * /rapport/deleteMyRapport:
 *   delete:
 *     summary: Supprimer un rapport de l'utilisateur connecté
 *     tags: [Rapport]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID du rapport à supprimer
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       401:
 *         description: Non autorisé
 *
 * /rapport/updateMyRapport:
 *   put:
 *     summary: Mettre à jour un rapport de l'utilisateur connecté
 *     tags: [Rapport]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rapport'
 *     responses:
 *       200:
 *         description: Rapport mis à jour avec succès
 *       401:
 *         description: Non autorisé
 */


//le upload.single("fichier") permet de recuperer le fichier , LE STOCK DANS uploads avec un nom unique et ajoute un obbet req.file. Ainsi la createRapport pour stocker le req.file.path dans le fileUrl