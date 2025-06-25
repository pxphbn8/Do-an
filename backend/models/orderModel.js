import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  totalPrice: Number,
   shippingInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  status: {
    type: String,
    enum: [
      'Chờ Xác Nhận',
      'Đã Xác Nhận',
      'Đang Giao Hàng',
      'Đã Giao Hàng',
      'Đã Từ Chối',
    ],
    default: 'Chờ Xác Nhận',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
