const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/search", controllers.job.search);
router.post("/add", controllers.job.add);

module.exports = router;