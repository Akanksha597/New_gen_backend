


const Portfolio = require("../models/PortfolioModel");

// CREATE (supports multiple images via "images" and legacy single via "image")
exports.createPortfolio = async (req, res, next) => {
  try {
    const { title, location, published, category } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }
 if (!location) {
      return res.status(400).json({ success: false, message: "location is required" });
    }
    const newPortfolio = {
      title,
      location,
      published: published ?? true,
      category,
    };

    // Handle multiple images (new)
    if (req.files && req.files.length > 0) {
      newPortfolio.images = req.files.map((file) => ({
        url: file.path || file.secure_url,
        originalName: file.originalname,
        public_id: file.filename || file.public_id || "",
        format: file.format || "",
        width: file.width || undefined,
        height: file.height || undefined,
      }));
      // For legacy compatibility, set primary legacy image
      newPortfolio.image = newPortfolio.images[0].url;
      newPortfolio.originalImageName = newPortfolio.images[0].originalName;
    } else if (req.file) {
      // Legacy single image
      const imageUrl = req.file.path || req.file.secure_url || "";
      newPortfolio.image = imageUrl;
      newPortfolio.originalImageName = req.body.originalImageName || req.file.originalname || "";
    }

    const created = new Portfolio(newPortfolio);
    await created.save();
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

// READ ALL
exports.getAllPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find();
    res.json({ success: true, data: portfolios });
  } catch (err) {
    next(err);
  }
};

// READ BY ID
exports.getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    res.json({ success: true, data: portfolio });
  } catch (err) {
    next(err);
  }
};

// UPDATE (replaces images if supplied)
exports.updatePortfolio = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        url: file.path || file.secure_url,
        originalName: file.originalname,
        public_id: file.filename || file.public_id || "",
        format: file.format || "",
        width: file.width || undefined,
        height: file.height || undefined,
      }));
      updateData.image = updateData.images[0].url;
      updateData.originalImageName = updateData.images[0].originalName;
    } else if (req.file) {
      updateData.image = req.file.path || req.file.secure_url;
      updateData.originalImageName = req.file.originalname || "";
    }

    const updated = await Portfolio.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deletePortfolio = async (req, res, next) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    res.json({ success: true, message: "Portfolio deleted successfully" });
  } catch (err) {
    next(err);
  }
};
