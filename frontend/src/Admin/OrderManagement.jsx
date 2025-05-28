import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    const updatedOrder = { status: newStatus };

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="container my-5">
      <h2>Quản Lý Đơn Hàng</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Khách Hàng</th>
              <th>Sản Phẩm</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.shippingInfo?.name}</td>
                <td>
                  {order.products.map((item, index) => (
                    <div key={index}>
                      {item.productId?.title || 'Tên sản phẩm không khả dụng'}
                    </div>
                  ))}
                </td>
                <td>${order.totalPrice}</td>
                <td>{order.status || "Chờ Xác Nhận"}</td>
                <td>
                  {order.status === "Chờ Xác Nhận" && (
                    <>
                      <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={() => updateOrderStatus(order._id, 'Đã Xác Nhận')}
                      >
                        Xác Nhận
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateOrderStatus(order._id, 'Đã Từ Chối')}
                      >
                        Từ Chối
                      </button>
                    </>
                  )}
                  {order.status === "Đã Xác Nhận" && (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => updateOrderStatus(order._id, 'Đang Giao Hàng')}
                    >
                      Xác Nhận Lấy Hàng
                    </button>
                  )}
                  {order.status === "Đang Giao Hàng" && (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => updateOrderStatus(order._id, 'Đã Giao Hàng')}
                    >
                      Giao Hàng Thành Công
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <NavLink to="/Admin" className="btn btn-primary">
        Quay Lại
      </NavLink>
    </div>
  );
};

export default OrderManagement;
