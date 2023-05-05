const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/search", controllers.job.search);
router.post("/add", controllers.job.add);
router.delete("/delete/:id", controllers.job.delete);

module.exports = router;