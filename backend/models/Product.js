import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: false, default: "" },
  category: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  desc:     { type: String, required: false, default: "" }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;

