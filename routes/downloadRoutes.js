const express = require("express");

const router = express.Router()

const {protect} = require("../middlewares/authMiddleware")
const {controllerDownload} = require("../controllers/downloadController")

router.get("/download/:rapportId",protect, controllerDownload)


module.exports = router