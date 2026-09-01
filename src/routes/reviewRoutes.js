const express = require("express");
const {
  getProductReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/", protect, createReview);

router.get("/", protect, adminOnly, getAllReviews);
router.put("/:id/status", protect, adminOnly, updateReviewStatus);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;
