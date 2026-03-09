

const express = require("express");
const router = express.Router();
const parser = require("../middleware/multer"); // cloudinary multer
const portfolioController = require("../controllers/portfolioController");


router.post("/", parser.array("images", 5), portfolioController.createPortfolio);
router.get("/", portfolioController.getAllPortfolios);
router.get("/:id", portfolioController.getPortfolioById);
router.put("/:id", parser.array("images", 5), portfolioController.updatePortfolio);
router.delete("/:id", portfolioController.deletePortfolio);

module.exports = router;
