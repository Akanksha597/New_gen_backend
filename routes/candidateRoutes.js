const express = require("express");
const router = express.Router();
const parser = require("../middleware/multer"); // Cloudinary Multer middleware
const candidateController = require("../controllers/candidateController");

// Count
// router.get("/count", candidateController.getCandidateCount);

// Create
router.post(
  "/create",
parser.fields([
  { name: "imageUrl", maxCount: 1 },
  { name: "aadharUrl", maxCount: 1 },
  { name: "panUrl", maxCount: 1 },
  { name: "bankStatementUrl", maxCount: 1 }
]),
 
  candidateController.createCandidate
);

// Get all (with filter + pagination)
router.get("/", candidateController.getCandidates);

// Get by ID
router.get("/:id", candidateController.getCandidateById);

// Update
router.put(
  "/:id",
  parser.fields([
    { name: "image", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  candidateController.updateCandidate
);

// Delete
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;
