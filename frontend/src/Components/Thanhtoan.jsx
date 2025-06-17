import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Thanhtoan = () => {
  const cartItems = useSelector((state) => state.handleCart);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    const usdToVnd = 10;
    const totalVnd = cartItems.reduce(
      (total, product) => total + product.qty * product.price * usdToVnd,
      0
    );
    return Math.max(1000, Math.round(totalVnd)); 
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

    const products = cartItems.map((item) => ({
      productId: item._id || item.id,
      quantity: item.qty
    }));

    const total = calculateTotal(); // tính tổng VND

    if (paymentMethod === 'momo') {
      try {
        const momoRes = await fetch('http://localhost:3000/api/momo-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
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
          window.location.href = momoData.payUrl;
        } else {
          alert("Không thể khởi tạo thanh toán MoMo.");
        }
      } catch (err) {
        console.error("MoMo Error:", err);
        alert("Lỗi khi xử lý thanh toán MoMo.");
      }
      return;
    }

    try {
      const order = {
        userId: user._id,
        products,
        totalPrice: total,
        status: 'Chờ Xác Nhận',
        shippingInfo
      };

      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        localStorage.setItem('buyerInfo', JSON.stringify(shippingInfo));
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

      {cartItems.length === 0 ? (
        <h3>Giỏ hàng trống</h3>
      ) : (
        <div>
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
        </div>
      )}
    </div>
  );
};
export default Thanhtoan;
