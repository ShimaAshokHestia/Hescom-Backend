const asyncHandler = require("express-async-handler");
const categoryService = require("../services/categoryService");
const { success } = require("../utils/apiResponse");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.status(200).json(success(categories));
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(success(category, 201));
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json(success(category));
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json(success(null));
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
