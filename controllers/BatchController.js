const Course = require("../models/CourseModel");
const Batch = require("../models/BatchModel");

// CREATE Batch
exports.createBatch = async (req, res) => {
  try {
    console.log("Incoming batch request:", req.body);

    const {
      courseName,
      timeSlot,
      mode,
      instructorName,
      startDate,
      endDate,
      seatsAvailable,
      isTrending,
      fee,
      contactNumber,
      location
    } = req.body;

    // Validation
    if (!courseName || !timeSlot || !mode) {
      console.warn("Missing required fields in batch request.");
      return res.status(400).json({
        success: false,
        message: "courseName, timeSlot, and mode are required."
      });
    }

    // 🔍 Find matching course
    const matchedCourse = await Course.findOne({ title: courseName });

    let isUpcoming = false;
    if (matchedCourse) {
      isUpcoming = true; // ✅ mark upcoming if course title matches
    }

    const newBatch = new Batch({
      courseName,
      timeSlot,
      mode,
      instructorName,
      startDate,
      endDate,
      seatsAvailable,
      isTrending,
      fee,
      contactNumber,
      location,
      isUpcoming
    });

    const savedBatch = await newBatch.save();

    console.log("Batch created successfully:", savedBatch._id);
    res.status(201).json({ success: true, data: savedBatch });
  } catch (error) {
    console.error("Error creating batch:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};


// GET All Batches
exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ startDate: 1 });
    console.log(`Retrieved ${batches.length} batches.`);
    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    console.error("Error fetching batches:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET Batch by ID
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching batch with ID:", id);

    const batch = await Batch.findById(id);

    if (!batch) {
      console.warn("Batch not found for ID:", id);
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    console.error("Error fetching batch by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// UPDATE Batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating batch with ID:", id, "Data:", req.body);

    const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedBatch) {
      console.warn("Batch not found for update:", id);
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    console.log("Batch updated successfully:", updatedBatch._id);
    res.status(200).json({ success: true, data: updatedBatch });
  } catch (error) {
    console.error("Error updating batch:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// DELETE Batch
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting batch with ID:", id);

    const deletedBatch = await Batch.findByIdAndDelete(id);

    if (!deletedBatch) {
      console.warn("Batch not found for deletion:", id);
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    console.log("Batch deleted successfully:", deletedBatch._id);
    res.status(200).json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting batch:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
