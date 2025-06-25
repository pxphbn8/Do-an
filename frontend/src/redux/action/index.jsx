export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: { ...product, qty: 1 }
  };
};

export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: product
  };
};

export const setCartFromServer = (products) => {
  const normalized = products.map(p => ({
    ...p,
    id: p.id || p.productId || p._id, // ép thành id chung
  qty: p.qty || 1
}));
console.log("Dispatch SET_CART:", normalized);
  return {
    type: 'SET_CART',
    payload: normalized,
  };
};

