const Brand = require("../models/Brand");
const AppError = require("../utils/AppError");

const getBrands = async () => {
  return Brand.find().sort({ value: 1 });
};

const createBrand = async (data) => {
  return Brand.create(data);
};

const deleteBrand = async (id) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw new AppError("Brand not found", 404);
  return true;
};

module.exports = { getBrands, createBrand, deleteBrand };
