const { toPlain } = require("./mapper");

const toCartDTO = (doc) => {
  const c = toPlain(doc);
  if (!c) return c;
  return {
    _id: c._id,
    user: c.user,
    items: c.items,
    updatedAt: c.updatedAt,
  };
};

module.exports = { toCartDTO };
