import React, { useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setCartFromServer, addCart, delCart } from '../redux/action';
import axios from 'axios';

const Cart = () => {
  const cartItemsRedux = useSelector(state => state.handleCart);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const didMountRef = useRef(false); // để ngăn useEffect gọi khi lần đầu

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.products) {
          dispatch(setCartFromServer(res.data.products));
        }
      } catch (err) {
        console.error('Lấy giỏ hàng lỗi:', err);
      }
    };
    fetchCart();
  }, [dispatch, token]);

  // Đồng bộ cart redux -> backend (chỉ sau lần đầu)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const updateBackendCart = async () => {
      if (!token) return;
      try {
        await axios.put('http://localhost:3000/cart',
          { products: cartItemsRedux },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Cập nhật giỏ hàng lỗi:', err);
      }
    };

    if (cartItemsRedux.length > 0) {
      updateBackendCart();
    }
  }, [cartItemsRedux, token]);

  const handleAdd = (product) => {
    dispatch(addCart(product));
  };

  const handleRemove = (product) => {
    dispatch(delCart(product));
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const calculateTotal = () => {
    return cartItemsRedux.reduce((total, product) => total + product.qty * product.price, 0);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {cartItemsRedux.length === 0 ? (
          <h3 className="text-center">Giỏ hàng của bạn trống.</h3>
        ) : (
          cartItemsRedux.map((product) => (
            <div className="col-md-4 mb-4" key={product.productId || product.id || product._id}>
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
