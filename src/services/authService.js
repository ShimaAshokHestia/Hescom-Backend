const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");
const { toAuthResponseDTO, toUserDTO } = require("../dtos/userDto");

const register = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !lastName || !email || !password) {
    throw new AppError("Please provide firstName, lastName, email and password", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 400);
  }

  const user = await User.create({ firstName, lastName, email, password });
  return toAuthResponseDTO(user, generateToken(user._id, user.role));
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return toAuthResponseDTO(user, generateToken(user._id, user.role));
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toUserDTO(user);
};

module.exports = { register, login, getProfile };
