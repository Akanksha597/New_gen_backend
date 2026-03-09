const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload'); 
const applicationController = require("../controllers/applicationController");

// Create a new Application
router.post("/", upload.single("resume"), applicationController.createApplication);

// Get all Applications
router.get("/", applicationController.getApplications);

// Get single Application by ID
router.get("/:id", applicationController.getApplicationById);

// Delete an Application by ID
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
