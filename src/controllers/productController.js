const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @route GET /api/products
// Supports: ?category=Skincare&brand=Lumière&search=serum&featured=true
//           &minPrice=10&maxPrice=100&sort=price_asc&page=1&limit=12
const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    search,
    featured,
    newArrival,
    bestSeller,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (featured) query.featured = featured === "true";
  if (newArrival) query.newArrival = newArrival === "true";
  if (bestSeller) query.bestSeller = bestSeller === "true";
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1 },
  };
  const sortBy = sortMap[sort] || { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const pageSize = Math.min(Number(limit) || 12, 100);

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort(sortBy)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(query),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.ceil(total / pageSize),
  });
});

// @route GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @route POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @route PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @route DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true });
});

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
