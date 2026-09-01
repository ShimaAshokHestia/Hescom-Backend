const asyncHandler = require("express-async-handler");
const reviewService = require("../services/reviewService");
const { success } = require("../utils/apiResponse");

// @route GET /api/reviews/product/:productId
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getProductReviews(req.params.productId);
  res.status(200).json(success(reviews));
});

// @route POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  res.status(201).json(success(review, 201));
});

// @route GET /api/reviews (admin)
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAllReviews(req.query.status);
  res.status(200).json(success(reviews));
});

// @route PUT /api/reviews/:id/status (admin)
const updateReviewStatus = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReviewStatus(req.params.id, req.body.status);
  res.status(200).json(success(review));
});

// @route DELETE /api/reviews/:id (admin)
const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id);
  res.status(200).json(success(null));
});

module.exports = {
  getProductReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
