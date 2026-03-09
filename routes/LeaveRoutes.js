const express = require("express");
const router = express.Router();
const Leavecontroller = require("../controllers/LeaveController");
// Routes
router.post("/", Leavecontroller.createLeave);
router.get("/", Leavecontroller.getLeaves);
router.get("/:id", Leavecontroller.getLeaveById);
router.put("/:id", Leavecontroller.updateLeave);
router.delete("/:id", Leavecontroller.deleteLeave);

module.exports = router;
