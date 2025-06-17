export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: product
  };
};

export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: product
  };
};

export const setCartFromServer = (products) => {
  return {
    type: 'SET_CART',
    payload: products,
  };
};
