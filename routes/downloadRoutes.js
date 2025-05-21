const express = require("express");

const router = express.Router()

const {protect} = require("../middlewares/authMiddleware")
const {controllerDownload} = require("../controllers/downloadController");
const { uploadToCloucinary } = require("../middlewares/upload");

router.get("/:rapportId",protect, controllerDownload)


module.exports = router