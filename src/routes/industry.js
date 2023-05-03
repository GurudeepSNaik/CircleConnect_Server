const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/get", controllers.industry.get);
router.post("/add", controllers.industry.add);
router.get("/industrywithjobs", controllers.industry.industrywithjobs);

module.exports = router;