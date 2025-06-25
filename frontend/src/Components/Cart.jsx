import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setCartFromServer } from '../redux/action';
import axios from 'axios';

const Cart = () => {
  const cartItemsRedux = useSelector(state => state.handleCart);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);

  // Lấy cart từ server
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.products) {
          dispatch(setCartFromServer(res.data.products));
        }
      } catch (err) {
        console.error('Lỗi khi lấy cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dispatch, token]);

  const handleAdd = async (product) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/cart/add',
        { product },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setCartFromServer(res.data.products));
    } catch (error) {
      console.error('Lỗi thêm sản phẩm:', error);
    }
  };

  const handleRemove = async (product) => {
    try {
      const productId = product.id || product.productId || product._id;
      const res = await axios.delete(
        `http://localhost:3000/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setCartFromServer(res.data.products));
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
    }
  };

  const formatCurrency = (amount) =>
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const calculateTotal = () =>
    cartItemsRedux.reduce((total, item) => total + item.qty * item.price, 0);

  return (
    <div className="container mt-4">
      <div className="row">
        {loading ? (
          <h3 className="text-center">Đang tải giỏ hàng...</h3>
        ) : cartItemsRedux.length === 0 ? (
          <h3 className="text-center">Giỏ hàng của bạn trống.</h3>
        ) : (
          cartItemsRedux.map((product) => (
            <div className="col-md-4 mb-4" key={product.id || product.productId || product._id}>
              <div className="card h-100 p-3">
                <img src={product.img} alt={product.title} className="img-fluid mb-2" />
                <h5>{product.title}</h5>
                <p className="lead fw-bold">
                  {product.qty} x {formatCurrency(product.price)} = {formatCurrency(product.qty * product.price)}
                </p>
                <div>
                  <button
                    className="btn btn-outline-dark me-2"
                    onClick={() => handleRemove(product)}
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => handleAdd(product)}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItemsRedux.length > 0 && (
        <div className="mt-4 text-end">
          <h4>Tổng tiền: {formatCurrency(calculateTotal())}</h4>
          <NavLink to="/Thanhtoan" className="btn btn-dark mt-3">
            <i className="fa fa-credit-card me-2"></i> Thanh toán
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Cart;
