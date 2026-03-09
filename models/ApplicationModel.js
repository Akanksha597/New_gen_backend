const mongoose = require("mongoose");
 
const applicationSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    message: { type: String },
     pdfUrl: String,
     pdfPublicId: String,
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Application", applicationSchema);