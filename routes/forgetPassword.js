
const express = require("express");
const { forgetPassword } = require("../controllers/forgetPassword");
const router = express.Router()

router.get("/forget-password" , forgetPassword);

module.exports = router