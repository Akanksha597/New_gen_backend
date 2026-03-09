const Leave = require("../models/LeaveModel");


exports.createLeave = async (req, res) => {
  try {
    console.log(" Incoming leave request:", req.body);

    const { employeeName, leaveFrom, leaveTo, noOfDays, resumeDutyOn, leaveReason, mobile, leaveAddress } = req.body;

    // Validation checks
    if (!employeeName || !leaveFrom || !leaveTo || !noOfDays || !resumeDutyOn || !leaveReason) {
      console.warn(" Missing required fields in leave request.");
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    const newLeave = new Leave({
      employeeName,
      leaveFrom,
      leaveTo,
      noOfDays,
      resumeDutyOn,
      leaveReason,
      mobile,
      leaveAddress,
    });

    const savedLeave = await newLeave.save();

    console.log("Leave request saved successfully:", savedLeave._id);
    res.status(201).json({ success: true, data: savedLeave });
  } catch (error) {
    console.error(" Error creating leave:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    console.log(` Retrieved ${leaves.length} leave requests.`);
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error(" Error fetching leaves:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


exports.getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Fetching leave with ID:", id);

    const leave = await Leave.findById(id);

    if (!leave) {
      console.warn(" Leave not found for ID:", id);
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    console.error(" Error fetching leave by ID:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


exports.updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Updating leave with ID:", id, "Data:", req.body);

    const updatedLeave = await Leave.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedLeave) {
      console.warn(" Leave not found for update:", id);
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    console.log(" Leave updated successfully:", updatedLeave._id);
    res.status(200).json({ success: true, data: updatedLeave });
  } catch (error) {
    console.error(" Error updating leave:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Deleting leave with ID:", id);

    const deletedLeave = await Leave.findByIdAndDelete(id);

    if (!deletedLeave) {
      console.warn(" Leave not found for deletion:", id);
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    console.log(" Leave deleted successfully:", deletedLeave._id);
    res.status(200).json({ success: true, message: "Leave deleted successfully" });
  } catch (error) {
    console.error(" Error deleting leave:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
