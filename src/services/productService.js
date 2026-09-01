const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { toProductDetailDTO, toProductListDTOs } = require("../dtos/productDto");

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  rating: { rating: -1 },
};

const buildQuery = ({
  category,
  brand,
  search,
  featured,
  newArrival,
  bestSeller,
  minPrice,
  maxPrice,
}) => {
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
  return query;
};

const getProducts = async (params) => {
  const { sort, page = 1, limit = 12 } = params;
  const query = buildQuery(params);
  const sortBy = SORT_MAP[sort] || { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const pageSize = Math.min(Number(limit) || 12, 100);

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort(sortBy)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(query),
  ]);

  return {
    items: toProductListDTOs(items),
    total,
    page: pageNum,
    pages: Math.ceil(total / pageSize),
  };
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug });
  if (!product) throw new AppError("Product not found", 404);
  return toProductDetailDTO(product);
};

const createProduct = async (data) => {
  const product = await Product.create(data);
  return toProductDetailDTO(product);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404);
  return toProductDetailDTO(product);
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);
  return true;
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
