const Candidate = require("../models/CandidateModel");





exports.createCandidate = async (req, res, next) => {
  try {
    console.log(" Incoming Candidate request body:", req.body);
    console.log(" Incoming Candidate files:", req.files);

    const imageUrl =
      req.files?.["imageUrl"]?.[0]?.path ||
      req.files?.["imageUrl"]?.[0]?.secure_url ||
      "";
    const aadharUrl =
      req.files?.["aadharUrl"]?.[0]?.path ||
      req.files?.["aadharUrl"]?.[0]?.secure_url ||
      "";
    const panUrl =
      req.files?.["panUrl"]?.[0]?.path ||
      req.files?.["panUrl"]?.[0]?.secure_url ||
      "";
    const bankStatementUrl =
      req.files?.["bankStatementUrl"]?.[0]?.path ||
      req.files?.["bankStatementUrl"]?.[0]?.secure_url ||
      "";

    let education = [];
    if (req.body.education) {
      try {
        if (typeof req.body.education === "string") {
          education = JSON.parse(req.body.education);
        } else {
          education = req.body.education;
        }
      } catch (err) {
        console.error(" Failed to parse education:", err.message);
        return res.status(400).json({
          success: false,
          message: "Invalid education format. Must be a valid JSON array.",
        });
      }
    }

    const newCandidate = new Candidate({
      ...req.body,
      education,
      imageUrl,
      aadharUrl,
      panUrl,
      bankStatementUrl,
    });

    console.log("🛠 Creating new candidate:", newCandidate);

    const savedCandidate = await newCandidate.save();

    console.log(" Candidate saved successfully:", savedCandidate._id);

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      data: savedCandidate,
    });
  } catch (error) {
    console.error(" Error creating candidate:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create candidate",
      error: error.message,
    });
  }
};

// GET all (with optional filter by name/email/mobile + pagination)
exports.getCandidates = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    console.log("🔍 Candidate filter query:", search);

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNo: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Candidate.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      candidates,
    });
  } catch (err) {
    console.error("Error in getCandidates:", err);
    next(err);
  }
};

// GET by ID
exports.getCandidateById = async (req, res, next) => {
  try {
    console.log("🔍 Fetching candidate with ID:", req.params.id);

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      console.warn("⚠ Candidate not found:", req.params.id);
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
  } catch (err) {
    console.error(" Error in getCandidateById:", err);
    next(err);
  }
};

// UPDATE
// exports.updateCandidate = async (req, res, next) => {
//   try {
//     console.log(" Updating candidate ID:", req.params.id);
//     console.log(" Update body:", req.body);
//     console.log("Update files:", req.files);

//     const updatedData = { ...req.body };

//     // Handle file uploads if provided
//     if (req.files?.["image"]) {
//       updatedData.imageUrl =
//         req.files["image"][0].path || req.files["image"][0].secure_url;
//     }
//     if (req.files?.["aadhar"]) {
//       updatedData.aadharUrl =
//         req.files["aadhar"][0].path || req.files["aadhar"][0].secure_url;
//     }
//     if (req.files?.["pan"]) {
//       updatedData.panUrl =
//         req.files["pan"][0].path || req.files["pan"][0].secure_url;
//     }
//     if (req.files?.["bankStatement"]) {
//       updatedData.bankStatementUrl =
//         req.files["bankStatement"][0].path ||
//         req.files["bankStatement"][0].secure_url;
//     }

//     // Parse education if string
//     if (updatedData.education) {
//       try {
//         if (typeof updatedData.education === "string") {
//           updatedData.education = JSON.parse(updatedData.education);
//         }
//       } catch (err) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid education format." });
//       }
//     }

//     const candidate = await Candidate.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       { new: true }
//     );

//     if (!candidate) {
//       console.warn("⚠ Candidate not found for update:", req.params.id);
//       return res.status(404).json({ error: "Candidate not found" });
//     }

//     console.log(" Candidate updated:", candidate);
//     res.json(candidate);
//   } catch (err) {
//     console.error(" Error in updateCandidate:", err);
//     next(err);
//   }
// };
exports.updateCandidate = async (req, res, next) => {
  try {
    console.log(" Updating candidate ID:", req.params.id);
    console.log(" Update body:", req.body);
    console.log("Update files:", req.files);

    const updatedData = { ...req.body };

    if (req.files?.["imageUrl"]) {
      updatedData.imageUrl =
        req.files["imageUrl"][0].path || req.files["imageUrl"][0].secure_url;
    }
    if (req.files?.["aadharUrl"]) {
      updatedData.aadharUrl =
        req.files["aadharUrl"][0].path ||
        req.files["aadharUrl"][0].secure_url;
    }
    if (req.files?.["panUrl"]) {
      updatedData.panUrl =
        req.files["panUrl"][0].path || req.files["panUrl"][0].secure_url;
    }
    if (req.files?.["bankStatementUrl"]) {
      updatedData.bankStatementUrl =
        req.files["bankStatementUrl"][0].path ||
        req.files["bankStatementUrl"][0].secure_url;
    }

    if (updatedData.education) {
      try {
        if (typeof updatedData.education === "string") {
          updatedData.education = JSON.parse(updatedData.education);
        }
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid education format." });
      }
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!candidate) {
      console.warn("⚠ Candidate not found for update:", req.params.id);
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log(" Candidate updated:", candidate);
    res.json(candidate);
  } catch (err) {
    console.error(" Error in updateCandidate:", err);
    next(err);
  }
};

// DELETE
exports.deleteCandidate = async (req, res, next) => {
  try {
    console.log("🗑 Deleting candidate with ID:", req.params.id);

    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      console.warn("⚠ Candidate not found for delete:", req.params.id);
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log("Candidate deleted:", candidate._id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(" Error in deleteCandidate:", err);
    next(err);
  }
};

// COUNT
exports.getCandidateCount = async (req, res) => {
  try {
    const count = await Candidate.countDocuments();
    console.log(" Total candidates count:", count);
    res.json({ count });
  } catch (error) {
    console.error(" Error in getCandidateCount:", error);
    res.status(500).json({ message: "Error counting candidates" });
  }
};
