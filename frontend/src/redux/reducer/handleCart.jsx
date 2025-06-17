const cart = [];

const handleCart = (state = cart, action) => {
  const product = action.payload;
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADDITEM":
      // Kiểm tra sản phẩm đã tồn tại chưa
    const exist = state.find((x) => (x.id || x._id) === (product.id || product._id));

      if (exist) {
        // Tăng số lượng
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        return [...state, { ...product, qty: 1 }];
      }

    case "DELITEM":
    const exist1 = state.find((x) => (x.id || x._id) === (product.id || product._id));
      if (exist1.qty === 1) {
        // Xóa sản phẩm khỏi giỏ
        return state.filter((x) => x.id !== exist1.id);
      } else {
        // Giảm số lượng
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }

    default:
      return state;
  }
};

export default handleCart;
