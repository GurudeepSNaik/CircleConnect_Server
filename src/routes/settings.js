const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

// router.get("/get", controllers.settings.get2);
router.get("/get/:id", controllers.settings.get);
router.post("/update", controllers.settings.update);

module.exports = router;