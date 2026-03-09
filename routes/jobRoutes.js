const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Create a new Job
router.post("/", jobController.createJob);

// Get all Jobs
router.get("/", jobController.getJobs);

// Get single Job by ID
router.get("/:id", jobController.getJobById);

// Update a Job by ID
router.put("/:id", jobController.updateJob);

// Delete a Job by ID
router.delete("/:id", jobController.deleteJob);

module.exports = router;
