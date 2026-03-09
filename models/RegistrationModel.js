// models/RegistrationModel.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentName: { type: String, trim: true },
    whatsappNumber: { type: String },
    email: { type: String, lowercase: true, trim: true },
    mobile: { type: String },
    panNumber: { type: String },
    passoutYear: { type: String },
    qualification: { type: String },

    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseBatch",
    },

    fees: { type: Number }, // total fees
    installmentType: { type: String, enum: ["First Installment", "Second Installment", "Full Payment"], default: "First Installment" },
    adhaarNumber: { type: String },
    referenceSource: { type: String },
    branch: { type: String },
    workingStatus: { type: String },
    termsAccepted: { type: Boolean, default: false },

    // 🔹 Payments array
    payments: [
      {
        orderId: { type: String },
        paymentId: { type: String },
        signature: { type: String },
        amount: { type: Number }, // store paid amount
        status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
        paidAt: { type: Date, default: Date.now },
      },
    ],

    totalPaid: { type: Number, default: 0 }, // sum of all payments

    enrollmentStatus: { type: String, enum: ["pending", "partially_paid", "paid", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
