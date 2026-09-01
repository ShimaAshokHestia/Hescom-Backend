const Coupon = require("../models/Coupon");
const AppError = require("../utils/AppError");

const getCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 });
};

const createCoupon = async (data) => {
  return Coupon.create(data);
};

const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw new AppError("Coupon not found", 404);
  return coupon;
};

const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw new AppError("Coupon not found", 404);
  return true;
};

const validateCoupon = async (code, orderValue = 0) => {
  const coupon = await Coupon.findOne({ code: String(code).toUpperCase(), active: true });
  if (!coupon) throw new AppError("Coupon not found or inactive", 404);

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new AppError("Coupon has expired", 400);
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached", 400);
  }
  if (orderValue < coupon.minOrderValue) {
    throw new AppError(`Minimum order value for this coupon is ${coupon.minOrderValue}`, 400);
  }

  const discount =
    coupon.type === "percentage" ? (orderValue * coupon.value) / 100 : coupon.value;

  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: Math.min(discount, orderValue),
  };
};

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
