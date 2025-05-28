import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import Danhgia from './Danhgia';

const Trangcapnhat = () => {
  const { orderId } = useParams();
  const [shippingStatus, setShippingStatus] = useState("Chờ Xác Nhận");
  const [orderDetails, setOrderDetails] = useState(null); // Lưu trữ thông tin chi tiết đơn hàng
console.log(orderId)
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Data từ API đơn hàng:", data);
          setShippingStatus(data.status);
          setOrderDetails(data); // Lưu thông tin chi tiết đơn hàng
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000);
    

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="container my-5">
      <h2>Cập Nhật Trạng Thái Giao Hàng</h2>
      <p>Đơn hàng của bạn hiện tại: <strong>{shippingStatus}</strong></p>
      {shippingStatus === "Đã Từ Chối" ? (
        <p>Rất tiếc, đơn hàng của bạn đã bị từ chối.</p>
      ) : shippingStatus === "Đã Giao Hàng" ? (
        <>
          <p>Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được giao thành công.</p>
          {orderDetails && <Danhgia orderDetails={orderDetails} />} {/* Truyền thông tin đơn hàng vào Danhgia */}
        </>
      ) : (
        <p>Chúng tôi sẽ cập nhật trạng thái tiếp theo sớm nhất.</p>
      )}
    </div>
  );
};

export default Trangcapnhat;
