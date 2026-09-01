const { toPlain } = require("./mapper");

const toReviewDTO = (doc) => {
  const r = toPlain(doc);
  if (!r) return r;
  return {
    _id: r._id,
    product: r.product,
    user: r.user,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    createdAt: r.createdAt,
  };
};

const toReviewDTOs = (docs) => (docs || []).map(toReviewDTO);

module.exports = { toReviewDTO, toReviewDTOs };
