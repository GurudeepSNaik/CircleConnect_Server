const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/get", controllers.industry.get);
router.post("/add", controllers.industry.add);

module.exports = router;