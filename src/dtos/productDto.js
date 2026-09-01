const { toPlain } = require("./mapper");

// Used for GET /api/products (grid/listing) - keeps the payload small
const toProductListDTO = (doc) => {
  const p = toPlain(doc);
  if (!p) return p;
  return {
    _id: p._id,
    id: p.id,
    sku: p.sku,
    brand: p.brand,
    name: p.name,
    slug: p.slug,
    image: p.image,
    hoverImage: p.hoverImage,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    reviews: p.reviews,
    discount: p.discount,
    badge: p.badge,
    stock: p.stock,
    featured: p.featured,
    newArrival: p.newArrival,
    bestSeller: p.bestSeller,
  };
};

// Used for GET /api/products/:slug and admin create/update - full detail
const toProductDetailDTO = (doc) => {
  const p = toPlain(doc);
  if (!p) return p;
  return {
    ...toProductListDTO(p),
    description: p.description,
    images: p.images,
    ingredients: p.ingredients,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

const toProductListDTOs = (docs) => (docs || []).map(toProductListDTO);

module.exports = { toProductListDTO, toProductDetailDTO, toProductListDTOs };
