const express = require("express");
const { getBrands, createBrand, deleteBrand } = require("../controllers/brandController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, adminOnly, createBrand);
router.delete("/:id", protect, adminOnly, deleteBrand);

module.exports = router;
