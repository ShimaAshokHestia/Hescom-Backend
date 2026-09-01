const { toPlain } = require("./mapper");

// Returned by register/login - includes the JWT
const toAuthResponseDTO = (userDoc, token) => {
  const u = toPlain(userDoc);
  return {
    _id: u._id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
    token,
  };
};

// Returned by GET /api/auth/me and anywhere else a user is exposed -
// deliberately never includes `password`, even if the query forgot to exclude it.
const toUserDTO = (userDoc) => {
  const u = toPlain(userDoc);
  if (!u) return u;
  return {
    _id: u._id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  };
};

module.exports = { toAuthResponseDTO, toUserDTO };
