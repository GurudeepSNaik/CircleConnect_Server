const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/country", controllers.user.country);
router.get("/provision", controllers.user.provisions);
router.get("/city", controllers.user.city);
router.post("/adduser", controllers.user.adduser);
router.get("/getuser", controllers.user.getuser);

module.exports = router;