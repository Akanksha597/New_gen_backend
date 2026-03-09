const express = require("express");
const router = express.Router();
const parser = require("../middleware/multer");
const testimonialController = require("../controllers/testimonialController");


router.get("/count", testimonialController.getTestimonialCount);
router.post("/", parser.single("image"), testimonialController.createTestimonial);
router.get("/", testimonialController.getTestimonials);
router.get("/:id", testimonialController.getTestimonialById);
router.put("/:id", parser.single("image"), testimonialController.updateTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
