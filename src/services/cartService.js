const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const replaceCart = async (userId, items = []) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items },
    { new: true, upsert: true, runValidators: true }
  ).populate("items.product");
  return cart;
};

const addItem = async (userId, { productId, quantity = 1 }) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  await cart.populate("items.product");
  return cart;
};

const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found", 404);

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  await cart.populate("items.product");
  return cart;
};

const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { upsert: true });
  return true;
};

module.exports = { getCart, replaceCart, addItem, removeItem, clearCart };
