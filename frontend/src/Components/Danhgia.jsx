import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Danhgia.css";

const Danhgia = ({ orderDetails }) => {
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitTime, setSubmitTime] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (orderDetails) {
      setBuyerInfo({
        name: orderDetails.shippingInfo?.name,
        phone: orderDetails.shippingInfo?.phone,
        address: orderDetails.shippingInfo?.address,
      });
    }
  }, [orderDetails]);

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCancel = () => {
    navigate("/Home"); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating === 0) {
      setError("Vui lòng chọn điểm đánh giá!");
      return;
    }

    if (!buyerInfo) {
      setError("Không tìm thấy thông tin người mua.");
      return;
    }

    if (!orderDetails || !Array.isArray(orderDetails.products)) {
      setError("Dữ liệu đơn hàng không hợp lệ.");
      return;
    }

    const reviewData = {
      rating,
      comment,
      customerName: buyerInfo.name,
      phone: buyerInfo.phone,
      address: buyerInfo.address,
      items: orderDetails.products.map(item => ({
        productId: item.productId?._id,
        title: item.productId?.title || "Không rõ tên sản phẩm"
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi gửi đánh giá.");
      }

      setSubmitted(true);
      setError("");
      setSubmitTime(new Date().toLocaleString());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="review-page">
      <h2>Đánh giá sản phẩm</h2>

      {buyerInfo && (
        <div>
          <p><strong>Người mua:</strong> {buyerInfo.name}</p>
          <p><strong>Số điện thoại:</strong> {buyerInfo.phone}</p>
          <p><strong>Địa chỉ:</strong> {buyerInfo.address}</p>
        </div>
      )}

      {orderDetails?.products && (
        <div>
          <h3>Sản phẩm đã mua:</h3>
          {orderDetails.products.map((item, index) => (
            <div key={index}>
              <p><strong>{item.productId?.title || "Không rõ tên sản phẩm"}</strong></p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div>
          <p>Đánh giá của bạn đã được gửi thành công!</p>
          <p><strong>Thời gian gửi:</strong> {submitTime}</p>
          <button onClick={handleCancel}>Về trang chủ</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Đánh giá: </label>
            <select value={rating} onChange={handleRatingChange}>
              <option value={0}>Chọn điểm đánh giá</option>
              <option value={1}>1 sao</option>
              <option value={2}>2 sao</option>
              <option value={3}>3 sao</option>
              <option value={4}>4 sao</option>
              <option value={5}>5 sao</option>
            </select>
          </div>
          <div>
            <label>Bình luận: </label>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Viết bình luận của bạn..."
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Gửi Đánh Giá</button>
          <button type="button" onClick={handleCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Danhgia;
