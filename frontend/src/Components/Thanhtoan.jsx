import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Thanhtoan = () => {
  const cartItems = useSelector((state) => state.handleCart);
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct")); // 🆕 kiểm tra mua ngay

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const usdToVnd = 10;
    if (buyNowProduct) {
      return Math.max(1000, Math.round(buyNowProduct.price * usdToVnd));
    }
    return Math.max(
      1000,
      Math.round(cartItems.reduce((total, item) => total + item.qty * item.price * usdToVnd, 0))
    );
  };

  const handlePayment = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("Bạn cần đăng nhập để thanh toán!");
      return;
    }

    const total = calculateTotal();

    // MoMo
    if (paymentMethod === 'momo') {
      try {
        const momoRes = await fetch('http://localhost:3000/api/momo-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: `order-${Date.now()}`,
            orderInfo: 'Thanh toán đơn hàng',
            redirectUrl: 'http://localhost:3001/thanhtoan?result=success',
            ipnUrl: 'http://localhost:3000/api/momo-callback'
          })
        });

        const momoData = await momoRes.json();
        if (momoData && momoData.payUrl) {
          return (window.location.href = momoData.payUrl);
        } else {
          alert("Không thể khởi tạo thanh toán MoMo.");
        }
      } catch (err) {
        console.error("MoMo Error:", err);
        alert("Lỗi khi xử lý thanh toán MoMo.");
      }
      return;
    }

    // Đơn hàng (COD hoặc Momo sau callback)
    try {
      const products = buyNowProduct
        ? [{ productId: buyNowProduct._id || buyNowProduct.id, quantity: 1 }]
        : cartItems.map((item) => ({
            productId: item.id,
            quantity: item.qty,
          }));

      const order = {
        userId: user._id,
        products,
        totalPrice: total,
        status: 'Chờ Xác Nhận',
        shippingInfo,
      };

      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        localStorage.setItem('buyerInfo', JSON.stringify(shippingInfo));
        localStorage.removeItem("buyNowProduct"); // 🧹 xoá sản phẩm mua ngay sau khi thanh toán
        alert("Đặt hàng thành công!");
        navigate(`/Trangcapnhat/${savedOrder._id}`);
      } else {
        alert("Đã xảy ra lỗi khi lưu đơn hàng!");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Lỗi kết nối server!");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('result') === 'success') {
      setSuccess(true);
    }
  }, [location.search]);

  if (success) {
    return (
      <div className="container text-center mt-5">
        <h2>Thanh toán thành công!</h2>
        <p>Cảm ơn bạn đã sử dụng MoMo để thanh toán.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Trang Thanh Toán</h2>

      <div className="mb-4">
        <h5>Thông tin nhận hàng</h5>
        <form>
          <div className="mb-3">
            <label className="form-label">Họ và tên</label>
            <input type="text" className="form-control" name="name" value={shippingInfo.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="form-control" name="phone" value={shippingInfo.phone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Địa chỉ</label>
            <input type="text" className="form-control" name="address" value={shippingInfo.address} onChange={handleChange} />
          </div>
        </form>

        <div className="mb-3">
          <h5>Phương thức thanh toán</h5>
          <div>
            <label>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Thanh toán khi nhận hàng (COD)
            </label>
          </div>
          <div>
            <label>
              <input type="radio" name="payment" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} /> Thanh toán bằng MoMo
            </label>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {buyNowProduct ? (
        <>
          <h5>{buyNowProduct.title}</h5>
          <p>1 x {buyNowProduct.price} USD</p>
          <hr />
          <h4>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND</h4>
          <button className="btn btn-success mt-3" onClick={handlePayment}>
            Xác nhận thanh toán
          </button>
        </>
      ) : cartItems.length === 0 ? (
        <h3>Giỏ hàng trống</h3>
      ) : (
        <>
          {cartItems.map((product, index) => (
            <div key={product.id || `${product.title}-${index}`} className="mb-3">
              <h5>{product.title}</h5>
              <p>{product.qty} x ${product.price} = ${product.qty * product.price}</p>
            </div>
          ))}
          <hr />
          <h4>Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND</h4>
          <button className="btn btn-success mt-3" onClick={handlePayment}>
            Xác nhận thanh toán
          </button>
        </>
      )}
    </div>
  );
};

export default Thanhtoan;
