import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ products: [] });

  
    const products = cart.products.map(item => ({
      id: item.productId.toString(),
      title: item.title,
      price: item.price,
      qty: item.qty,
      img: item.img
    }));

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};


export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products } = req.body;

    const normalizedProducts = products.map(item => ({
      productId: mongoose.Types.ObjectId(item.id || item.productId), 
      title: item.title,
      price: item.price,
      qty: item.qty,
      img: item.img
    }));

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: normalizedProducts });
    } else {
      cart.products = normalizedProducts;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
