const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Connect DB
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

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

app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

// 404
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;