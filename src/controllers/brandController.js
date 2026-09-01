const asyncHandler = require("express-async-handler");
const brandService = require("../services/brandService");
const { success } = require("../utils/apiResponse");

const getBrands = asyncHandler(async (req, res) => {
  const brands = await brandService.getBrands();
  res.status(200).json(success(brands));
});

const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json(success(brand, 201));
});

const deleteBrand = asyncHandler(async (req, res) => {
  await brandService.deleteBrand(req.params.id);
  res.status(200).json(success(null));
});

module.exports = { getBrands, createBrand, deleteBrand };
