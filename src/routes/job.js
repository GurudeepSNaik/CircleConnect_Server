const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/list", controllers.job.list);
router.get("/details", controllers.job.details);
router.get("/activeJobs", controllers.job.activeJobs);
router.get("/inActiveJobs", controllers.job.inActiveJobs);
router.get("/activeJobsForWorker", controllers.job.activeJobsForWorker);
router.get("/completedJobsForWorker", controllers.job.completedJobsForWorker);
router.post("/search", controllers.job.search);
router.post("/add", controllers.job.add);
router.delete("/delete/:id", controllers.job.delete);

module.exports = router;