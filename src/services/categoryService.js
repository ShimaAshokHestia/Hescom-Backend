const Category = require("../models/Category");
const AppError = require("../utils/AppError");

const getCategories = async () => {
  return Category.find().sort({ title: 1 });
};

const createCategory = async (data) => {
  return Category.create(data);
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError("Category not found", 404);
  return true;
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
