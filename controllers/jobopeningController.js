const Job = require("../models/JobModal");

// CREATE Job
exports.createJob = async (req, res) => {
  try {
    console.log("Incoming job request:", req.body);
    console.log("Uploaded file:", req.file); // multer file info

    const { title, description, category, link } = req.body;

    if (!title || !description || !category || !link) {
      return res.status(400).json({
        success: false,
        message: "title, description, category, and link are required."
      });
    }

    // Save the uploaded file path if exists
    const image = req.file ? req.file.path : null;

    const newJob = new Job({ title, description, category, link, image });
    const savedJob = await newJob.save();

    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};




// GET All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    console.log(`Retrieved ${jobs.length} jobs.`);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET Job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching job with ID:", id);

    const job = await Job.findById(id);

    if (!job) {
      console.warn("Job not found for ID:", id);
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error fetching job by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// UPDATE Job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating job with ID:", id, "Data:", req.body);

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedJob) {
      console.warn("Job not found for update:", id);
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    console.log("Job updated successfully:", updatedJob._id);
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// DELETE Job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting job with ID:", id);

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      console.warn("Job not found for deletion:", id);
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    console.log("Job deleted successfully:", deletedJob._id);
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
