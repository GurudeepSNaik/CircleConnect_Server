const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/", controllers.login.logout);

module.exports = router;