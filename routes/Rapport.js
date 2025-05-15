const express = require("express")
const { createRapport, deleteRapport, updateRapport } = require("../controllers/rapportController")

const router = express.Router()

router.post("/create", createRapport)
router.delete("/delete/:id", deleteRapport)
router.put("/update/:id", updateRapport)

module.exports = router