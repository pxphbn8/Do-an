import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products } = req.body; 

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products });
    } else {
      cart.products = products;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
