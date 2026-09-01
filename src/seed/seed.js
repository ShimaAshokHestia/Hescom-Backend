// Imports the frontend's existing public/data JSON files into MongoDB.
// Run:    npm run seed
// Wipe:   npm run seed:destroy
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const productsData = require("./data/products.json");
const categoriesData = require("./data/categories.json");
const brandsData = require("./data/brands.json");

const run = async () => {
  await connectDB();

  const destroy = process.argv.includes("--destroy");

  if (destroy) {
    await Promise.all([Product.deleteMany(), Category.deleteMany(), Brand.deleteMany()]);
    console.log("All product/category/brand data removed.");
    return mongoose.disconnect();
  }

  await Promise.all([Product.deleteMany(), Category.deleteMany(), Brand.deleteMany()]);

  await Product.insertMany(productsData);

  const categories = (categoriesData.categories || categoriesData).map((c) => ({
    title: c.value,
    value: c.value,
    slug: c.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
  await Category.insertMany(categories);

  await Brand.insertMany(brandsData);

  console.log(
    `Seeded ${productsData.length} products, ${categories.length} categories, ${brandsData.length} brands.`
  );
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
