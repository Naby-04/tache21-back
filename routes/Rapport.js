const express = require("express")
const { createRapport, deleteRapport, updateRapport } = require("../controllers/rapportController")
const upload = require("../middlewares/upload")
const router = express.Router()

router.post("/create",upload.single("fileUrl"), createRapport)
router.delete("/delete/:id", deleteRapport)
router.put("/update/:id", updateRapport)

module.exports = router

//le upload.single("fichier") permet de recuperer le fichier , LE STOCK DANS uploads avec un nom unique et ajoute un obbet req.file. Ainsi la createRapport pour stocker le req.file.path dans le fileUrl