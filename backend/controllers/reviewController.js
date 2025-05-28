import Review from '../models/reviewModel.js';

export const createReview = async (req, res) => {
  try {
    console.log('Received review data:', req.body); 

    const { rating, customerName, items } = req.body;

    // Validate dữ liệu cơ bản
    if (!rating || !customerName) {
      return res.status(400).json({ message: 'Rating và customerName là bắt buộc.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items phải là mảng và không được rỗng.' });
    }

    const review = new Review(req.body);
    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error when saving review:', error);
    res.status(500).json({ message: 'Lỗi khi lưu đánh giá', error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error: error.message });
  }
};
