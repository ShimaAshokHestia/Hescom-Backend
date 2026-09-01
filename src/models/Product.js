const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },

    image: { type: String, required: true },
    hoverImage: { type: String },
    images: { type: [String], default: [] },

    ingredients: { type: [String], default: [] },

    category: { type: String, required: true, index: true },

    price: { type: Number, required: true },
    oldPrice: { type: Number },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    discount: { type: String },
    badge: { type: String },

    stock: { type: Number, required: true, default: 0 },

    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// keeps the numeric `id` the old JSON/frontend expects, auto-incremented
productSchema.add({ id: { type: Number, unique: true, index: true } });

productSchema.pre("save", async function (next) {
  if (this.isNew && this.id == null) {
    const last = await this.constructor.findOne().sort({ id: -1 }).select("id");
    this.id = last ? last.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
