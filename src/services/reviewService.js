const Review = require("../models/Review");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const getProductReviews = async (productId) => {
  return Review.find({ product: productId, status: "approved" })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 });
};

const createReview = async (userId, { productId, rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);

  const existing = await Review.findOne({ product: productId, user: userId });
  if (existing) throw new AppError("You already reviewed this product", 400);

  return Review.create({ product: productId, user: userId, rating, comment });
};

const getAllReviews = async (status) => {
  const query = status ? { status } : {};
  return Review.find(query)
    .populate("user", "firstName lastName email")
    .populate("product", "name slug")
    .sort({ createdAt: -1 });
};

const syncProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, status: "approved" } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (stats[0]) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviews: stats[0].count,
    });
  }
};

const updateReviewStatus = async (id, status) => {
  const review = await Review.findById(id);
  if (!review) throw new AppError("Review not found", 404);

  review.status = status;
  await review.save();

  if (status === "approved") {
    await syncProductRating(review.product);
  }

  return review;
};

const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw new AppError("Review not found", 404);
  return true;
};

module.exports = {
  getProductReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
