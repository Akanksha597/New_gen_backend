// server.js (or index.js)
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require('express-rate-limit');

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const jobRoutes = require("./routes/jobopeningRoutes");
const courseRoutes = require("./routes/courseRoutes");
const batchRoutes = require("./routes/batchRoutes");
const RegistrationRoutes = require("./routes/RegistartionRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // ✅ Razorpay route

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/batch", batchRoutes);
app.use("/api/v1/Registration", RegistrationRoutes);
app.use("/api/v1/payment", paymentRoutes); // ✅ Razorpay route mounted here

// ✅ 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// ✅ Custom Error Handler
app.use(errorHandler);


app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("MongoDB connected");
    } catch (err) {
      console.error("DB Connection Error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// ✅ Start server
// const PORT = process.env.PORT || 5016;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
module.exports = app