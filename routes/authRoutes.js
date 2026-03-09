const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const { forgotPassword, resetPassword } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests—try again in an hour.",
});

router.post("/signup", signup);
router.post("/login", limiter, login);
router.post("/logout", logout); // ✅ Add logout route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router;
