const { toPlain } = require("./mapper");

const toCouponDTO = (doc) => {
  const c = toPlain(doc);
  if (!c) return c;
  return {
    _id: c._id,
    code: c.code,
    type: c.type,
    value: c.value,
    minOrderValue: c.minOrderValue,
    expiresAt: c.expiresAt,
    active: c.active,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
  };
};

const toCouponDTOs = (docs) => (docs || []).map(toCouponDTO);

module.exports = { toCouponDTO, toCouponDTOs };
