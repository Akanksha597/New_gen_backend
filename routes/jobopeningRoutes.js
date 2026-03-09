const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobopeningController");


router.post(
  "/",
  upload.single("image"), // multer middleware
  createJob
);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
