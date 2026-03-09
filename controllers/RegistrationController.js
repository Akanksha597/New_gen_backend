const Student = require("../models/RegistrationModel");
const CourseBatch = require("../models/CourseModel");

// ---------------- CREATE STUDENT ----------------
exports.createStudent = async (req, res) => {
  console.log("➡️ Incoming request to create student:", req.body);

  try {
    const { batch, ...studentData } = req.body;

    if (!batch) {
      console.warn("⚠️ Batch ID is required but missing.");
      return res.status(400).json({
        success: false,
        message: "Batch ID is required",
      });
    }

    // ✅ Check if batch exists
    const courseBatch = await CourseBatch.findById(batch);
    if (!courseBatch) {
      console.warn("⚠️ Batch not found for ID:", batch);
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    // ✅ Copy fee from CourseBatch
    const student = await Student.create({
      ...studentData,
      batch: courseBatch._id,
      fees: courseBatch.fee, // auto assign fee
    });

    console.log("✅ Student created successfully:", student._id);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: student,
    });
  } catch (error) {
    console.error("❌ Error creating student:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating student",
      error: error.message,
    });
  }
};

// ---------------- GET ALL STUDENTS ----------------
exports.getStudents = async (req, res) => {
  console.log("➡️ Fetching all students...");
  try {
    const students = await Student.find().populate("batch");

    if (!students.length) {
      console.warn("⚠️ No students found in database.");
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    console.log(`✅ Found ${students.length} students.`);
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};

// ---------------- GET STUDENT BY ID ----------------
exports.getStudentById = async (req, res) => {
  console.log("➡️ Fetching student by ID:", req.params.id);

  try {
    const student = await Student.findById(req.params.id).populate("batch");

    if (!student) {
      console.warn("⚠️ Student not found for ID:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("✅ Student found:", student._id);
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("❌ Error fetching student:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};

// ---------------- UPDATE STUDENT ----------------
exports.updateStudent = async (req, res) => {
  console.log("➡️ Updating student ID:", req.params.id, "with data:", req.body);

  try {
    const { batch, ...updateData } = req.body;

    if (batch) {
      const courseBatch = await CourseBatch.findById(batch);
      if (!courseBatch) {
        console.warn("⚠️ Batch not found for update:", batch);
        return res.status(404).json({
          success: false,
          message: "Batch not found",
        });
      }
      updateData.batch = courseBatch._id;
      updateData.fees = courseBatch.fee; // ✅ update fee if batch changes
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("batch");

    if (!student) {
      console.warn("⚠️ Student not found for update:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("✅ Student updated:", student._id);
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("❌ Error updating student:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating student",
      error: error.message,
    });
  }
};

// ---------------- DELETE STUDENT ----------------
exports.deleteStudent = async (req, res) => {
  console.log("➡️ Deleting student ID:", req.params.id);

  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      console.warn("⚠️ Student not found for deletion:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("✅ Student deleted:", student._id);
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting student:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};
