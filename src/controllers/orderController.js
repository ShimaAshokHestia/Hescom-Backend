const asyncHandler = require("express-async-handler");
const orderService = require("../services/orderService");
const { success } = require("../utils/apiResponse");

// @route POST /api/orders (customer checkout)
const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res.status(201).json(success(order, 201));
});

// @route GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  res.status(200).json(success(orders));
});

// @route GET /api/orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(200).json(success(orders));
});

// @route PUT /api/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body);
  res.status(200).json(success(order));
});

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
