// const mongoose = require("mongoose");

// const educationSchema = new mongoose.Schema({
//   qualification: String, // BE/BTech, Diploma, ITI, 12th, 10th
//   trade: String,
//   institute: String,
//   yearOfPassing: String,
//   percentage: String,
// });

// const candidateSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     mobileNo: { type: Number, required: true },
//     email: String,
//     dateOfBirth: String,
//     fatherName: String,
//     fatherOccupation: String,
//     motherName: String,
//     motherOccupation: String,
//     maritalStatus: String,

//     presentAddress: String,
//     permanentAddress: String,

//     lastEmployee: String,
//     totalExp: String,
//     currentEmployee: String,
//     inHandSalary: String,

//     bike: { type: Boolean, default: false },

//     education: [educationSchema],

//     imageUrl: { type: String },
//     aadharUrl: { type: String },
//     panUrl: { type: String },
//     bankStatementUrl: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Candidate", candidateSchema);



const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  qualification: String, // BE/BTech, Diploma, ITI, 12th, 10th
  trade: String,
  institute: String,
  yearOfPassing: String,
  percentage: String,
});

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobileNo: { type: Number, required: true },
    email: String,
    dateOfBirth: String,
    fatherName: String,
    fatherOccupation: String,
    motherName: String,
    motherOccupation: String,
    maritalStatus: String,

    presentAddress: String,
    permanentAddress: String,

    lastEmployee: String,
    totalExp: String,
    currentEmployee: String,
    inHandSalary: String,

    bike: { type: Boolean, default: false },

    education: [educationSchema],

    imageUrl: String,
    aadharUrl: String,
    panUrl: String,
    bankStatementUrl: String,

    // New fields
    panCardNumber: String,
    aadharCardNumber: String,
    bankDetails: String, // Can be used for additional info if needed
    accountHolderName: String, // As per Bank
    bankName: String,
    ifscCode: String,
    accountNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
