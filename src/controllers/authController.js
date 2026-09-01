const asyncHandler = require("express-async-handler");
const authService = require("../services/authService");
const { success } = require("../utils/apiResponse");

// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const payload = await authService.register(req.body);
  res.status(201).json(success(payload, 201));
});

// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const payload = await authService.login(req.body);
  res.status(200).json(success(payload));
});

// @route GET /api/auth/me
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.status(200).json(success(user));
});

module.exports = { registerUser, loginUser, getProfile };
