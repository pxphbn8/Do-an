import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String },
  customerName: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
