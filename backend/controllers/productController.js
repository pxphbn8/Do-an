import Product from '../models/Product.js';

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
};

// Lấy chi tiết sản phẩm theo id
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết sản phẩm' });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("Received body:", req.body); 

    const { title, quantity, price, category, img } = req.body;


    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = new Product({ title, quantity, price, category, img });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create product failed:", error); 
    res.status(500).json({
      message: 'Error creating product',
      error: error.message || error.toString(),    
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
    res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Thiếu tham số tìm kiếm" });
  }

  try {
    const products = await Product.find({
      title: { $regex: query, $options: 'i' }
    });

    if (!Array.isArray(products)) {
      return res.status(500).json({ message: "Kết quả không hợp lệ", data: products });
    }

    res.json(products);
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
