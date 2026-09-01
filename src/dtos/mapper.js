// Mongoose docs need .toObject(); aggregation/lean results are already plain.
// Every DTO mapper below runs its input through this first.
const toPlain = (doc) => {
  if (!doc) return doc;
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
};

module.exports = { toPlain };
