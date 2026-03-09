const CourseBatch = require("../models/CourseModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinaryService = require("../utils/cloudinary");

// ---------------- Helper: Delete Cloudinary Files ----------------
const deleteCloudinaryFiles = async (files = []) => {
  for (const f of files) {
    if (f.publicId) {
      console.log("🗑️ Deleting file from Cloudinary:", f.publicId);
      await cloudinaryService.deleteFile(f.publicId);
    }
  }
};

// ---------------- CREATE BATCH ----------------
exports.createBatch = asyncErrorHandler(async (req, res) => {
  console.log("📩 Create batch request:", req.body);

  // Required fields validation
  const requiredFields = ["courseName", "timeSlot", "mode", "description", "category", "fee", "duration", "contactNumber"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      console.warn(`⚠️ Missing required field: ${field}`);
      return res.status(400).json({ success: false, message: `${field} is required` });
    }
  }

  // Prevent duplicate batch for same courseName + timeSlot
  const existing = await CourseBatch.findOne({ courseName: req.body.courseName, timeSlot: req.body.timeSlot });
  if (existing) {
    console.warn("⚠️ Batch already exists for this course & time slot");
    return res.status(400).json({ success: false, message: "Batch already exists for this course & time slot" });
  }

  const data = {
    courseName: req.body.courseName,
    timeSlot: req.body.timeSlot,
    mode: req.body.mode,
    instructorName: req.body.instructorName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    seatsAvailable: req.body.seatsAvailable,
    isTrending: req.body.isTrending === "true",
    isUpcomingBatch: req.body.isUpcomingBatch === "true",
    fee: req.body.fee,
    contactNumber: req.body.contactNumber,
    location: req.body.location,
    description: req.body.description,
    category: req.body.category,
    duration: req.body.duration,
    images: [],
    syllabus: null,
  };

  // Upload images if provided
  if (req.files?.images?.length) {
    console.log(`📤 Uploading ${req.files.images.length} images...`);
    const imageUploads = req.files.images.map(file =>
      cloudinaryService.uploadFile(file.buffer, "batches/images")
        .then(({ url, public_id }) => ({ url, publicId: public_id }))
    );
    data.images = await Promise.all(imageUploads);
  }

  // Upload syllabus if provided
  if (req.files?.syllabus?.length) {
    console.log("📤 Uploading syllabus PDF...");
    const pdfUpload = await cloudinaryService.uploadFile(req.files.syllabus[0].buffer, "batches/syllabus");
    data.syllabus = { url: pdfUpload.url, publicId: pdfUpload.public_id };
  }

  const batch = await CourseBatch.create(data);
  console.log("✅ Batch created:", batch._id);
  res.status(201).json({ success: true, data: batch });
});

// ---------------- GET ALL BATCHES ----------------
exports.getAllBatches = asyncErrorHandler(async (req, res) => {
  const { keyword } = req.query;
  console.log("📩 Fetching all batches. Keyword:", keyword);

  let filter = {};
  if (keyword) filter.courseName = { $regex: keyword, $options: "i" };

  const batches = await CourseBatch.find(filter).sort({ createdAt: -1 });
  const totalCount = await CourseBatch.countDocuments(filter);
  const overallCount = await CourseBatch.countDocuments();

  console.log(`✅ Found ${batches.length} batches (filtered: ${totalCount}, overall: ${overallCount})`);
  res.status(200).json({ success: true, totalCount, overallCount, data: batches });
});

// ---------------- GET SINGLE BATCH ----------------
exports.getBatchById = asyncErrorHandler(async (req, res) => {
  console.log("📩 Fetching batch by ID:", req.params.id);

  const batch = await CourseBatch.findById(req.params.id);
  if (!batch) {
    console.warn("⚠️ Batch not found:", req.params.id);
    return res.status(404).json({ success: false, message: "Batch not found" });
  }

  console.log("✅ Found batch:", batch._id);
  res.status(200).json({ success: true, data: batch });
});

// ---------------- UPDATE BATCH ----------------
exports.updateBatch = asyncErrorHandler(async (req, res) => {
  console.log("📩 Updating batch:", req.params.id);

  const existing = await CourseBatch.findById(req.params.id);
  if (!existing) {
    console.warn("⚠️ Batch not found for update:", req.params.id);
    return res.status(404).json({ success: false, message: "Batch not found" });
  }

  const updateData = {
    courseName: req.body.courseName ?? existing.courseName,
    timeSlot: req.body.timeSlot ?? existing.timeSlot,
    mode: req.body.mode ?? existing.mode,
    instructorName: req.body.instructorName ?? existing.instructorName,
    startDate: req.body.startDate ?? existing.startDate,
    endDate: req.body.endDate ?? existing.endDate,
    seatsAvailable: req.body.seatsAvailable ?? existing.seatsAvailable,
    isTrending: req.body.isTrending !== undefined ? req.body.isTrending === "true" : existing.isTrending,
    isUpcomingBatch: req.body.isUpcomingBatch !== undefined ? req.body.isUpcomingBatch === "true" : existing.isUpcomingBatch,
    fee: req.body.fee ?? existing.fee,
    contactNumber: req.body.contactNumber ?? existing.contactNumber,
    location: req.body.location ?? existing.location,
    description: req.body.description ?? existing.description,
    category: req.body.category ?? existing.category,
    duration: req.body.duration ?? existing.duration,
  };

  // Replace images if new ones uploaded
  if (req.files?.images?.length) {
    console.log("♻️ Replacing batch images...");
    await deleteCloudinaryFiles(existing.images);
    const newImages = await Promise.all(req.files.images.map(file =>
      cloudinaryService.uploadFile(file.buffer, "batches/images")
        .then(({ url, public_id }) => ({ url, publicId: public_id }))
    ));
    updateData.images = newImages;
  }

  // Replace syllabus if new one uploaded
  if (req.files?.syllabus?.length) {
    console.log("♻️ Replacing syllabus...");
    if (existing.syllabus?.publicId) await cloudinaryService.deleteFile(existing.syllabus.publicId);
    const pdfUpload = await cloudinaryService.uploadFile(req.files.syllabus[0].buffer, "batches/syllabus");
    updateData.syllabus = { url: pdfUpload.url, publicId: pdfUpload.public_id };
  }

  const updated = await CourseBatch.findByIdAndUpdate(req.params.id, updateData, { new: true });
  console.log("✅ Batch updated:", updated._id);
  res.status(200).json({ success: true, data: updated });
});

// ---------------- DELETE BATCH ----------------
exports.deleteBatch = asyncErrorHandler(async (req, res) => {
  console.log("📩 Deleting batch:", req.params.id);

  const existing = await CourseBatch.findById(req.params.id);
  if (!existing) {
    console.warn("⚠️ Batch not found for delete:", req.params.id);
    return res.status(404).json({ success: false, message: "Batch not found" });
  }

  await deleteCloudinaryFiles(existing.images);
  if (existing.syllabus?.publicId) await cloudinaryService.deleteFile(existing.syllabus.publicId);

  await CourseBatch.findByIdAndDelete(req.params.id);
  console.log("🗑️ Batch deleted:", req.params.id);
  res.status(200).json({ success: true, message: "Batch deleted successfully" });
});
