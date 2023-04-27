const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/search", controllers.job.search);

module.exports = router;