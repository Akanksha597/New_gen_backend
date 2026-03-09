

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email address"],
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: "Invalid mobile number",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false, // never return password in queries
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: {
      validator: function (val) {
        // Only works on CREATE or SAVE, not on update
        return val === this.password;
      },
      message: "Passwords do not match",
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// 🔐 Pre-save: hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if modified

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // remove confirmPassword field
  next();
});

// 🔐 Method to compare password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 🔐 Method to generate password reset token
   userSchema.methods.createPasswordResetToken = function () {
   const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

  return resetToken; // send this to frontend/email
};

module.exports = mongoose.model("User", userSchema);
