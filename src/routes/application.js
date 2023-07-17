const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/applicants", controllers.application.getApplicants);
router.get("/getApplications", controllers.application.getApplications);
router.get("/applicationWithApplicantDetails", controllers.application.getApplicationWithApplicantDetails);
router.get("/recentApplicants", controllers.application.recentApplicants);
router.post("/apply", controllers.application.apply);
router.post("/approveorreject", controllers.application.approveorreject);

module.exports = router;