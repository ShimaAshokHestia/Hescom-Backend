const asyncHandler = require("express-async-handler");
const couponService = require("../services/couponService");
const { success } = require("../utils/apiResponse");

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponService.getCoupons();
  res.status(200).json(success(coupons));
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(201).json(success(coupon, 201));
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  res.status(200).json(success(coupon));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  res.status(200).json(success(null));
});

// @route POST /api/coupons/validate (customer, at checkout)
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;
  const result = await couponService.validateCoupon(code, orderValue);
  res.status(200).json(success(result));
});

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };
