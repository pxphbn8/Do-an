import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: [
      'Chờ Xác Nhận',
      'Chờ Lấy Hàng',
      'Đang Giao Hàng',
      'Đã Giao Hàng',
      'Đã Từ Chối',
    ],
    default: 'Chờ Xác Nhận',
  },
}, { timestamps: true });

const Status = mongoose.model('status', statusSchema);

export default Status;
