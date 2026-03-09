const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  leaveFrom: { type: Date, required: true },
  leaveTo: { type: Date, required: true },
  noOfDays: { type: Number, required: true },
  resumeDutyOn: { type: Date, required: true },
  leaveReason: { type: String, required: true },
  mobile: { type: String },
  leaveAddress: { type: String },
//   signature: { type: String },
  date: { type: Date, default: Date.now },


});

module.exports = mongoose.model("Leave", leaveSchema);
