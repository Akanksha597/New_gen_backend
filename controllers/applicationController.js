const Application = require("../models/ApplicationModel");
const { uploadFile, deleteFile } = require("../utils/cloudinary"); // Cloudinary helper methods

// exports.createApplication = async (req, res) => {
//   try {
//     console.log(" Incoming application request:", req.body);

//     const { full_name, email, mobile, message, jobId } = req.body;

//     if (!full_name || !email || !mobile || !jobId) {
//       return res.status(400).json({ success: false, message: "All required fields must be provided." });
//     }

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "Resume PDF is required." });
//     }

//     const resumeUrl = req.file.path;       // Cloudinary file URL
//     const resumePublicId = req.file.filename; // Cloudinary public ID

//     const newApplication = new Application({
//       full_name,
//       email,
//       mobile,
//       message,
//       pdfUrl: resumeUrl,
//       pdfPublicId: resumePublicId,
//       jobId,
//     });

//     const savedApplication = await newApplication.save();

//     console.log(" Application created successfully:", savedApplication._id);
//     res.status(201).json({ success: true, data: savedApplication });
//   } catch (error) {
//     console.error(" Error creating application:", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//   }
// };

exports.createApplication = async (req, res) => {
  try {
    const { full_name, email, mobile, message, jobId } = req.body;
    let pdfUrl = '';
    let pdfPublicId = '';

    if (!full_name || !email || !mobile || !jobId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided."
      });
    }

    // If file uploaded, handle upload
    if (req.file) {
      const result = await uploadFile(req.file.buffer, 'resumes');  // Upload to cloud storage in "resumes" folder

      pdfUrl = result.url;
      pdfPublicId = result.public_id;
    } else {
      return res.status(400).json({
        success: false,
        message: "Resume PDF file is required."
      });
    }

    const newApplication = new Application({
      full_name,
      email,
      mobile,
      message,
      pdfUrl,
      pdfPublicId,
      jobId,
    });

    const savedApplication = await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: savedApplication,
    });

  } catch (error) {
    console.error("Error uploading resume:", error.message);
    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
      error: error.message,
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId");
    console.log(` Retrieved ${applications.length} applications.`);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error(" Error fetching applications:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Fetching application with ID:", id);

    const application = await Application.findById(id).populate("jobId");

    if (!application) {
      console.warn(" Application not found for ID:", id);
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error(" Error fetching application by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Deleting application with ID:", id);

    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      console.warn(" Application not found for deletion:", id);
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    console.log(" Application deleted successfully:", deletedApplication._id);
    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error(" Error deleting application:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
