const { toPlain } = require("./mapper");

const toCategoryDTO = (doc) => {
  const c = toPlain(doc);
  if (!c) return c;
  return {
    _id: c._id,
    title: c.title,
    value: c.value,
    description: c.description,
    icon: c.icon,
    slug: c.slug,
  };
};

const toCategoryDTOs = (docs) => (docs || []).map(toCategoryDTO);

module.exports = { toCategoryDTO, toCategoryDTOs };
