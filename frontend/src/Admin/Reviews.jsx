import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [showReviews, setShowReviews] = useState(true);
  const [selectedRating, setSelectedRating] = useState("all");

  
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:3000/reviews");

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi lấy danh sách đánh giá.");
      }

      const data = await response.json();
      const sortedReviews = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sortedReviews);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  

  // Lọc đánh giá theo số sao
  const filteredReviews = selectedRating === "all"
    ? reviews
    : reviews.filter((review) => review.rating === parseInt(selectedRating));

  return (
    <div className="reviews-page">
      <div className="header1">
        <NavLink to="/Admin" className="close-btn">X</NavLink>
        <h2>Tất Cả Đánh Giá</h2>
      </div>

 
  
 

      {/* Bộ lọc theo số sao */}
      <div className="filter-container">
        <label htmlFor="ratingFilter">Lọc theo số sao:</label>
        <select
          id="ratingFilter"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      {showReviews && (
        <div className="reviews-container">
          {error && <p className="error-message">{error}</p>}

          {filteredReviews.length === 0 ? (
            <p className="no-reviews">Không có đánh giá phù hợp.</p>
          ) : (
            <ul>
              {filteredReviews.map((review, index) => (
                <li key={index}>
                  <p><strong>Đánh giá:</strong> {review.rating} sao</p>
                  <p><strong>Bình luận:</strong> {review.comment}</p>
                  <p><strong>Người đánh giá:</strong> {review.customerName}</p>
                  <p><strong>Số điện thoại:</strong> {review.phone}</p>
                  <p><strong>Địa chỉ:</strong> {review.address}</p>

                  {review.items && review.items.length > 0 && (
                    <div>
                      <strong>Sản phẩm đã mua:</strong>
                      <ul>
                        {review.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <p>{item.title}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p><strong>Thời gian gửi:</strong> {new Date(review.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;
