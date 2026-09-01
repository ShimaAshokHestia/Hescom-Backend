const { toPlain } = require("./mapper");

const toOrderDTO = (doc) => {
  const o = toPlain(doc);
  if (!o) return o;
  return {
    _id: o._id,
    user: o.user,
    items: o.items,
    shippingAddress: o.shippingAddress,
    itemsTotal: o.itemsTotal,
    shippingFee: o.shippingFee,
    total: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
};

const toOrderDTOs = (docs) => (docs || []).map(toOrderDTO);

module.exports = { toOrderDTO, toOrderDTOs };
