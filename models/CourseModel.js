const mongoose = require('mongoose');

const courseBatchSchema = new mongoose.Schema({
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
  images: [
    {
      url: { type: String },
      publicId: { type: String },
    }
  ],
  description: {
    type: String,
    required: true,
  },
  syllabus: {
    url: { type: String },
    publicId: { type: String },
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isUpcomingBatch: {
    type: Boolean,
    default: false,
  },
  category: {
  type: String,
  enum: ['Development', 'Database', 'Cloud', 'SAP', 'Testing'],
  required: true,
},
  fee: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('CourseBatch', courseBatchSchema);
