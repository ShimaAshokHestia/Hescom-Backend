const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true },
    key: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
