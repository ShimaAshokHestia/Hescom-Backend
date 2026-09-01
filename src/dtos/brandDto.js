const { toPlain } = require("./mapper");

const toBrandDTO = (doc) => {
  const b = toPlain(doc);
  if (!b) return b;
  return {
    _id: b._id,
    value: b.value,
    key: b.key,
    logo: b.logo,
  };
};

const toBrandDTOs = (docs) => (docs || []).map(toBrandDTO);

module.exports = { toBrandDTO, toBrandDTOs };
