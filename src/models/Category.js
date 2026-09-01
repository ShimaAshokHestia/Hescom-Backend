const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
