const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/providersJobs", controllers.user.providersJobs);
router.post("/adduser", controllers.user.adduser);
router.post("/getuser", controllers.user.getuser);
router.delete("/delete/:id", controllers.user.deleteuser);

module.exports = router;