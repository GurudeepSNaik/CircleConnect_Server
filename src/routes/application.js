const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/apply", controllers.application.apply);
router.get("/applicants", controllers.application.getApplicants);
router.get("/applicationWithApplicantDetails", controllers.application.getApplicationWithApplicantDetails);
router.post("/approveorreject", controllers.application.approveorreject);

module.exports = router;