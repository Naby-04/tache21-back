const express = require("express")
const { createRapport } = require("../controllers/rapportController")

const router = express.Router()

router.post("/create", createRapport)

module.exports = router