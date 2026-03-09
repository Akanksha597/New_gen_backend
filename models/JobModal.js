const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Devops","Java","Python","JavaScript","Data Science","UI/UX","Testing","Product Management","HR","Sales","Marketing"],
      required: true,
    },
    link: { type: String, required: true },
    image: { type: String }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
