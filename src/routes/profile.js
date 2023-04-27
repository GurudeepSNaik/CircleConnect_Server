const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/add", controllers.profile.add);
router.get("/get", controllers.profile.get);
router.post("/edit", controllers.profile.edit);

module.exports = router;