

const mongoose = require("mongoose");

const imageMetaSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    originalName: { type: String, trim: true },
    public_id: { type: String, trim: true },
    format: { type: String },
    
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
   location: {
      type: String,
       required: true,
      trim: true,
    },
    image: {
      type: String,
      required: function () {
        return !(this.images && this.images.length > 0);
      },
    },
    originalImageName: {
      type: String,
    },

    images: {
      type: [imageMetaSchema],
      default: [],
    },

    category: {
      type: String,
      required: true,
      enum: ["Show All"],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual to surface a primary image (prefers new images array)
portfolioSchema.virtual("primaryImage").get(function () {
  if (this.images && this.images.length > 0 && this.images[0].url) {
    return this.images[0].url;
  }
  return this.image || null;
});

portfolioSchema.set("toJSON", { virtuals: true });
portfolioSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("PortfolioModel", portfolioSchema);
