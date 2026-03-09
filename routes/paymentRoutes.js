// backend/routes/paymentRoutes.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Student = require("../models/RegistrationModel");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify payment -> update Student record
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentId, amount } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !studentId || !amount) {
      return res.status(400).json({ success:false, message:"Missing fields for verification" });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success:false, message:"Invalid signature" });
    }

    // Add payment object
    const paymentObj = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: Number(amount),
      status: "paid",
      paidAt: new Date(),
    };

    // Find student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success:false, message:"Student not found" });

    // Push payment and update totalPaid
    student.payments.push(paymentObj);
    student.totalPaid += Number(amount);

    // Update enrollment status
    if (student.totalPaid === 0) student.enrollmentStatus = "pending";
    else if (student.totalPaid < student.fees) student.enrollmentStatus = "partially_paid";
    else student.enrollmentStatus = "paid";

    await student.save();

    res.json({
      success: true,
      message: "Payment verified and student updated",
      data: {
        totalPaid: student.totalPaid,
        remaining: student.fees - student.totalPaid,
        enrollmentStatus: student.enrollmentStatus,
        payments: student.payments,
      },
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success:false, message: err.message });
  }
});

module.exports = router;
