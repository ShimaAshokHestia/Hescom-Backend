const asyncHandler = require("express-async-handler");
const cartService = require("../services/cartService");
const { success } = require("../utils/apiResponse");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json(success(cart));
});

const replaceCart = asyncHandler(async (req, res) => {
  const cart = await cartService.replaceCart(req.user._id, req.body.items);
  res.status(200).json(success(cart));
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body);
  res.status(200).json(success(cart));
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  res.status(200).json(success(cart));
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  res.status(200).json(success(null));
});

module.exports = { getCart, replaceCart, addItem, removeItem, clearCart };
