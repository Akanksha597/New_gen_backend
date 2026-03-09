// controllers/bannerController.js
const Banner = require("../models/BannerModel");
const { uploadBuffer, deleteByPublicId } = require("../utils/cloudinary");

const MAX_BANNERS = 5;

exports.createBanner = async (req, res) => {
  try {
    console.log("Incoming Banner request body:", req.body);
    console.log("Incoming Banner files:", req.files);

    const heroTitle = req.body.heroTitle || "";
    const incomingFiles = req.files || [];

    if (!incomingFiles.length) {
      return res.status(400).json({ success: false, message: "No banner files provided" });
    }

    if (incomingFiles.length > MAX_BANNERS) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_BANNERS} banners allowed.`,
      });
    }

    const banners = incomingFiles.map(file => ({
      imageUrl: file.path,   // already uploaded URL
      publicId: file.filename // Cloudinary public_id
    }));

    const newBannerDoc = await Banner.create({
      heroTitle,
      banners
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBannerDoc
    });
  } catch (error) {
    console.error("createBanner error:", error);
    return res.status(500).json({
      success: false,
      message: "Create failed",
      error: error.message
    });
  }
};



/**
 * Get all banners
 */
exports.getBanners = async (req, res) => {
  try {
    const docs = await Banner.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: docs });
  } catch (err) {
    console.error("getBanners error:", err);
    return res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

/**
 * Get single banner by id
 */
exports.getBannerById = async (req, res) => {
  try {
    const doc = await Banner.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Banner not found" });
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("getBannerById error:", err);
    return res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
};

/**
 * Update banner:
 * - if new files provided in req.files.banners -> replace banners array (and delete old cloudinary images)
 * - otherwise update heroTitle only
 */
exports.updateBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await Banner.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Banner not found" });

    const update = {};
    if (req.body.heroTitle !== undefined) update.heroTitle = req.body.heroTitle;

    const incomingFiles = req.files || [];

    if (incomingFiles.length) {
      if (incomingFiles.length > MAX_BANNERS) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${MAX_BANNERS} banners are allowed.`,
        });
      }

      // upload new files
      const newBanners = [];
      for (const file of incomingFiles) {
        const { url, public_id } = await uploadBuffer(file.buffer, "banners");
        newBanners.push({ imageUrl: url, publicId: public_id });
      }

      // collect old publicIds to delete
      const oldPublicIds = (existing.banners || []).map((b) => b.publicId).filter(Boolean);

      update.banners = newBanners;

      // update DB (return new document)
      const updated = await Banner.findByIdAndUpdate(id, update, { new: true });

      // delete old cloudinary images (non-blocking best-effort)
      for (const pid of oldPublicIds) {
        try {
          await deleteByPublicId(pid);
        } catch (e) {
          console.error("Failed to delete old Cloudinary image", pid, e.message || e);
        }
      }

      return res.status(200).json({ success: true, data: updated });
    }

    // no new files -> update heroTitle only
    const updated = await Banner.findByIdAndUpdate(id, update, { new: true });
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateBanner error:", err);
    return res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};

/**
 * Delete banner doc and its images from Cloudinary
 */
exports.deleteBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await Banner.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Banner not found" });

    // Collect publicIds to delete
    const publicIds = (existing.banners || []).map((b) => b.publicId).filter(Boolean);

    // Delete DB doc
    await Banner.findByIdAndDelete(id);

    // Attempt to delete remote images (best-effort)
    for (const pid of publicIds) {
      try {
        await deleteByPublicId(pid);
      } catch (e) {
        console.error("Failed to delete Cloudinary image", pid, e.message || e);
      }
    }

    return res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    console.error("deleteBanner error:", err);
    return res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
};
