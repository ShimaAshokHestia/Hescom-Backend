const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ value: 1 });
  res.json(brands);
});

const createBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.create(req.body);
  res.status(201).json(brand);
});

const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }
  res.json({ success: true });
});

module.exports = { getBrands, createBrand, deleteBrand };
