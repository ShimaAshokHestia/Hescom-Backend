const Brand = require("../models/Brand");
const AppError = require("../utils/AppError");
const { toBrandDTO, toBrandDTOs } = require("../dtos/brandDto");

const getBrands = async () => {
  const brands = await Brand.find().sort({ value: 1 });
  return toBrandDTOs(brands);
};

const createBrand = async (data) => {
  const brand = await Brand.create(data);
  return toBrandDTO(brand);
};

const deleteBrand = async (id) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw new AppError("Brand not found", 404);
  return true;
};

module.exports = { getBrands, createBrand, deleteBrand };
