import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      price: Number,
      qty: Number,
      img: String
    }
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
