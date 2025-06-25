const handleCart = (state = [], action) => {
  const product = action.payload || {}; // đảm bảo không undefined

  const productId = product.id || product._id || product.productId;

  switch (action.type) {
    case "SET_CART":
       console.log("Reducer SET_CART payload:", action.payload);
      return action.payload.map(item => ({
        ...item,
        id: item.id || item.productId || item._id, // ép id về dạng chuẩn
        qty: item.qty || 1
      }));

    case "ADDITEM":
      const exist = state.find(x => (x.id || x._id) === productId);
      if (exist) {
        return state.map(x =>
          (x.id || x._id) === productId ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        return [...state, { ...product, id: productId, qty: 1 }];
      }

    case "DELITEM":
      const exist1 = state.find(x => (x.id || x._id) === productId);
      if (exist1.qty === 1) {
        return state.filter(x => (x.id || x._id) !== productId);
      } else {
        return state.map(x =>
          (x.id || x._id) === productId ? { ...x, qty: x.qty - 1 } : x
        );
      }

    default:
      return state;
  }
};


export default handleCart;

