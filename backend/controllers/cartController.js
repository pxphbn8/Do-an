import mongoose from 'mongoose';
import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log(" Không có cart trong DB");
      return res.json({ products: [] });
    }

    const products = cart.products.map(item => ({
      id: item.productId?.toString() || "",
      title: item.title,
      price: item.price,
      qty: item.qty,
      img: item.img
    }));

    console.log("✅ Trả về cart:", products);
    res.json({ products });
  } catch (error) {
    console.error(" Lỗi trong getCart:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      console.warn(" products không phải là mảng");
      return res.status(400).json({ message: "Products phải là một mảng" });
    }

    const normalizedProducts = products.map((item, index) => {
      if (!item.id && !item.productId) {
        console.warn(` Thiếu id ở sản phẩm thứ ${index}`);
      }

      return {
        productId: mongoose.Types.ObjectId(item.id || item.productId),
        title: item.title || "No title",
        price: item.price || 0,
        qty: item.qty || 1,
        img: item.img || ""
      };
    });

    console.log(" normalizedProducts:", normalizedProducts);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log("🆕 Không tìm thấy cart, tạo mới...");
      cart = new Cart({ userId, products: normalizedProducts });
    } else {
      console.log("🔁 Tìm thấy cart, cập nhật sản phẩm...");
      cart.products = normalizedProducts;
    }

    await cart.save();

    console.log(" Cart đã lưu thành công:", cart);
    res.json(cart);
  } catch (error) {
    console.error(" Lỗi trong updateCart:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm 1 sản phẩm vào giỏ hàng
export const addProductToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product } = req.body; 
console.log('🛒 Sản phẩm thêm vào:', product); 
    if (!product || !product.id) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIdStr = product.id.toString();

    const existingProductIndex = cart.products.findIndex(
      p => p.productId.toString() === productIdStr
    );

    if (existingProductIndex !== -1) {
      // Sản phẩm đã có trong giỏ, tăng qty
      cart.products[existingProductIndex].qty += product.qty || 1;
    } else {
      // Thêm sản phẩm mới
      cart.products.push({
        productId: new mongoose.Types.ObjectId(product.id),
        title: product.title || "No title",
        price: product.price || 0,
        qty: product.qty || 1,
        img: product.img || ""
      });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(" Lỗi trong addProductToCart:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xóa 1 sản phẩm khỏi giỏ hàng
export const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId trong params" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    cart.products = cart.products.filter(
      p => p.productId.toString() !== productId.toString()
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(" Lỗi trong removeProductFromCart:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
