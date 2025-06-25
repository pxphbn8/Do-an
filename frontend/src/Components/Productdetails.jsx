import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom"; 
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { setCartFromServer } from '../redux/action';
import axios from 'axios';
import './Productdetails.css';

const Productdetails = () => {
  const { id } = useParams();
  const [productdetails, setProductdetails] = useState(null);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); //  dùng để chuyển trang

  //  Thêm sản phẩm vào giỏ hàng (gửi backend)
  const addProduct = async (product) => {
    const productId = product._id || product.id;

    if (!productId) {
      console.warn(" Không có product ID:", product);
      alert("Không thể thêm sản phẩm vào giỏ hàng: thiếu ID!");
      return;
    }

    const body = {
      product: {
        id: productId,
        title: product.title,
        price: product.price,
        qty: 1,
        img: product.img
      }
    };

    try {
      const res = await axios.post('http://localhost:3000/api/cart/add', body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setCartFromServer(res.data.products));
      alert(" Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error(" Lỗi khi thêm sản phẩm:", err);
      alert(" Thêm sản phẩm thất bại!");
    }
  };

  //  Mua ngay (không thêm vào cart)
  const handleBuyNow = (product) => {
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    navigate("/Thanhtoan");
  };

  // Lấy chi tiết sản phẩm
  const getProductdetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`);
      const data = await response.json();
      console.log(" Product Details:", data);
      setProductdetails(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    getProductdetails();
  }, [id]);

  const ShowProducts = ({ product }) => {
    if (!product) return <div>Loading...</div>;

    return (
      <>
        <div className="col-md-6 mb-4 pe-4">
          <img src={`${product.img}`} alt={product.title} className="img-fluid rounded shadow" />
        </div>

        <div className="col-md-6">
          <h1 className="display-5">{product.title}</h1>
          <h5 className="product-desc">{product.desc}</h5>
          <h3 className="display-6 fw-bold my-4">
            {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </h3>

          {/* Nút thêm vào giỏ hàng */}
          <button className="btn btn-outline-dark me-3" onClick={() => addProduct(product)}>
            <i className="fa fa-cart-plus me-2"></i> Add to Cart
          </button>

          {/* Nút mua ngay */}
          <button className="btn btn-dark" onClick={() => handleBuyNow(product)}>
            <i className="fa fa-credit-card me-2"></i> Buy Now
          </button>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          {productdetails ? <ShowProducts product={productdetails} /> : <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default Productdetails;
