const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/", controllers.spam.addSpamComments);
router.get('/getSpam',controllers.spam.getSpamUserList);
module.exports = router;