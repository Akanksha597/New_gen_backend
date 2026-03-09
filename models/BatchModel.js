const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    timeSlot: { type: String, required: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], required: true },
    instructorName: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    seatsAvailable: { type: Number },
    isTrending: { type: Boolean, default: false },
    fee: { type: Number },
    contactNumber: { type: String },
    location: { type: String },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Batch', batchSchema);
