const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

// Create JWT Token
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/* =========================
   SIGNUP
========================= */
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, mobileNumber, role } =
      req.body;

    if (!name || !email || !password || !confirmPassword || !mobileNumber) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      mobileNumber,
      role,
    });

    const token = createToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Email is incorrect.",
      });
    }

    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Password is incorrect.",
      });
    }

    const token = createToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGOUT
========================= */
exports.logout = async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
    token: null,
  });
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "No user found" });

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Reset token generated",
      resetToken,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message: "Token is invalid or has expired",
      });

    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const jwtToken = createToken(user._id);

    res.status(200).json({
      message: "Password reset successful",
      token: jwtToken,
    });
  } catch (err) {
    next(err);
  }
};