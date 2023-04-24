const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/login", controllers.login.login);
router.post("/register", controllers.login.register);

module.exports = router;