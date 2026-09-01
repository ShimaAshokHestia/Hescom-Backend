const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const { toCategoryDTO, toCategoryDTOs } = require("../dtos/categoryDto");

const getCategories = async () => {
  const categories = await Category.find().sort({ title: 1 });
  return toCategoryDTOs(categories);
};

const createCategory = async (data) => {
  const category = await Category.create(data);
  return toCategoryDTO(category);
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError("Category not found", 404);
  return toCategoryDTO(category);
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError("Category not found", 404);
  return true;
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
