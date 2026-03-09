

const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protectRoute = async (req, res, next) => {
  try {
    let token;
      
    // 1. Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "You are not logged in!" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    // 4. Grant access
    req.user = currentUser; // attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized, token failed" });
  }
};

