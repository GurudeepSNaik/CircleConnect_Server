const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/get", controllers.notifications.get);
router.delete("/delete", controllers.notifications.delete);

module.exports = router;