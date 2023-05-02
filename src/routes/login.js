const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/login", controllers.login.login);
router.post("/register", controllers.login.register);
router.post("/verifyotp", controllers.login.verifyotp);
router.post("/resendotp", controllers.login.resendotp);
router.post("/forgotpassword", controllers.login.forgotpassword);
router.post("/verifyotpforregeneratepassword", controllers.login.verifyotpforregeneratepassword);
router.post("/updatepassword", controllers.login.updatepassword);
router.get("/country", controllers.login.country);
router.post("/province", controllers.login.province);

module.exports = router;