const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// @route POST /api/orders  (customer checkout)
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, shippingFee = 0 } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    itemsTotal,
    shippingFee,
    total: itemsTotal + Number(shippingFee),
  });

  res.status(201).json(order);
});

// @route GET /api/orders/mine  (customer's own orders)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route GET /api/orders  (admin: all orders)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "firstName lastName email").sort({ createdAt: -1 });
  res.json(orders);
});

// @route PUT /api/orders/:id/status  (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
});

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
