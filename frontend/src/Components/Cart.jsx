import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setCartFromServer, addCart, delCart } from '../redux/action';
import axios from 'axios';

const Cart = () => {
  const cartItemsRedux = useSelector(state => state.handleCart);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');  

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.products) {
          // Đồng bộ redux với toàn bộ giỏ hàng lấy từ backend
          dispatch(setCartFromServer(res.data.products));
        }
      } catch (err) {
        console.error('Lấy giỏ hàng lỗi:', err);
      }
    };
    fetchCart();
  }, [dispatch, token]);

  // Khi cartItemsRedux thay đổi, cập nhật backend
  useEffect(() => {
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

  const calculateTotal = () => {
    return cartItemsRedux.reduce((total, product) => total + product.qty * product.price, 0);
  };

  return (
    <div>
      <div className="row">
        {cartItemsRedux.length === 0 ? (
          <h3>Your cart is empty.</h3>
        ) : (
          cartItemsRedux.map((product) => (
            <div className="col-md-4" key={product.productId || product.id || product._id}>
              <img src={product.img} alt={product.title} className="img-fluid" />
              <div>
                <h5 className="card-text">{product.title}</h5>
                <p className="lead fw-bold">
                  {product.qty} X ${product.price} = ${product.qty * product.price}
                </p>
                <button
                  className="btn btn-outline-dark me-4"
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
          ))
        )}
      </div>

      {cartItemsRedux.length > 0 && (
        <div className="mt-4">
          <h4>Total Price: ${calculateTotal()}</h4>
        </div>
      )}
      <div className="buttons ms-2">
        <NavLink to="/Thanhtoan" className="btn btn-outline-dark">
          <i className="fa fa-user me-1"></i> Thanhtoan
        </NavLink>
      </div>
    </div>
  );
};

export default Cart;
