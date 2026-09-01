const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");

const toAuthPayload = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  token: generateToken(user._id, user.role),
});

const register = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !lastName || !email || !password) {
    throw new AppError("Please provide firstName, lastName, email and password", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 400);
  }

  const user = await User.create({ firstName, lastName, email, password });
  return toAuthPayload(user);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return toAuthPayload(user);
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

module.exports = { register, login, getProfile };
