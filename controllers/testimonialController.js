const Testimonial = require("../models/TestimonialModel");


exports.createTestimonial = async (req, res, next) => {
  try {
    const { name, message, starRating, designation, location,published  } = req.body;
    if (!name || !message || !location) {
      return res.status(400).json({ error: "Name, message, and location are required." });
    }

    const image = req.file?.path || req.file?.secure_url || "";

    const newTestimonial = new Testimonial({
      name,
      message,
      starRating,
      designation,
      location,
      image,
      published ,
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    next(err);
  }
};


exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
};

exports.getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (err) {
    next(err);
  }
};


exports.updateTestimonial = async (req, res, next) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.image = req.file.path || req.file.secure_url;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json(testimonial);
  } catch (err) {
    next(err);
  }
};


exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};


exports.getTestimonialCount = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error counting testimonials" });
  }
};