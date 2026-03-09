const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: false,
  }
}, { _id: false });

const bannerModelSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    required: false,
  },
  banners: [bannerSchema] // array of banners
}, { 
  timestamps: true,
});

module.exports = mongoose.model('Banner', bannerModelSchema);
