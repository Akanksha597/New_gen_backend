const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("express-rate-limit");

// Load env variables
dotenv.config();

const app = express();

// MongoDB connection flag
let isConnected = false;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (Vercel required)
app.set("trust proxy", 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// ✅ MongoDB auto connect middleware
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB connected");
    }
    next();
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    return res.status(500).json({
      status: "fail",
      message: "Database connection failed",
    });
  }
});

// Routes
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const jobRoutes = require("./routes/jobopeningRoutes");
const courseRoutes = require("./routes/courseRoutes");
const batchRoutes = require("./routes/batchRoutes");
const RegistrationRoutes = require("./routes/RegistartionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/batch", batchRoutes);
app.use("/api/v1/registration", RegistrationRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;