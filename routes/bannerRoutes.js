// routes/bannerRoutes.js
const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const upload = require("../middleware/multer");

// Create - accept multiple files under field "banners" (max 5 in multer config or change)
router.post("/", upload.array("banners", 5), bannerController.createBanner);

// Get all
router.get("/", bannerController.getBanners);

// Get single
router.get("/:id", bannerController.getBannerById);

// Update (replace banners if files uploaded)
router.put("/:id", upload.array("banners", 5), bannerController.updateBanner);

// Delete
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
