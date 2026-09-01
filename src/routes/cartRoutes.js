const express = require("express");
const {
  getCart,
  replaceCart,
  addItem,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // every cart route requires login

router.get("/", getCart);
router.put("/", replaceCart);
router.post("/items", addItem);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);

module.exports = router;
