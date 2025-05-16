const express = require("express")
const { createRapport, deleteRapport, updateRapport, getRapport, getOneRapport } = require("../controllers/rapportController")
const upload = require("../middlewares/upload")
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/create", protect, upload.single("fileUrl"), createRapport)
router.get("/all", getRapport)
router.delete("/:id", deleteRapport)
router.put("/:id", updateRapport)
router.get("/one/:id", getOneRapport)

module.exports = router

//le upload.single("fichier") permet de recuperer le fichier , LE STOCK DANS uploads avec un nom unique et ajoute un obbet req.file. Ainsi la createRapport pour stocker le req.file.path dans le fileUrl