const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const { toOrderDTO, toOrderDTOs } = require("../dtos/orderDto");

const createOrder = async (userId, { items, shippingAddress, shippingFee = 0 }) => {
  if (!items || items.length === 0) {
    throw new AppError("No order items provided", 400);
  }

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    itemsTotal,
    shippingFee,
    total: itemsTotal + Number(shippingFee),
  });
  return toOrderDTO(order);
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return toOrderDTOs(orders);
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 });
  return toOrderDTOs(orders);
};

const updateOrderStatus = async (id, { status, paymentStatus }) => {
  const order = await Order.findById(id);
  if (!order) throw new AppError("Order not found", 404);

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  return toOrderDTO(order);
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
