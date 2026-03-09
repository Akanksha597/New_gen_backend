const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/v1/contact", require("./routes/contactRoutes"));
app.use("/api/v1/banners", require("./routes/bannerRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/v1/jobs", require("./routes/jobopeningRoutes"));
app.use("/api/v1/courses", require("./routes/courseRoutes"));
app.use("/api/v1/batch", require("./routes/batchRoutes"));
app.use("/api/v1/registration", require("./routes/RegistartionRoutes"));
app.use("/api/v1/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running 🚀"
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;