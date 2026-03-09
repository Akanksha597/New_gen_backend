const express = require("express");
const router = express.Router();
const studentController = require("../controllers/RegistrationController");

// ---------------- STUDENT ROUTES ----------------

// ✅ Create new student
router.post("/", studentController.createStudent);

// ✅ Get all students
router.get("/", studentController.getStudents);

// ✅ Get single student by ID
router.get("/:id", studentController.getStudentById);

// ✅ Update student by ID
router.put("/:id", studentController.updateStudent);

// ✅ Delete student by ID
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
