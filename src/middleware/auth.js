const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/AppError");

// Verifies the Bearer token and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      throw new AppError("Not authorized, user no longer exists", 401);
    }
    next();
  } catch (err) {
    throw new AppError("Not authorized, token invalid or expired", 401);
  }
});

// Restrict route to admins only (use after `protect`)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new AppError("Admin access required", 403);
};

module.exports = { protect, adminOnly };
