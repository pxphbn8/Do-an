import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';
import './Productdetails.css';


const Productdetails = () => {
  const { id } = useParams();
  const [productdetails, setProductdetails] = useState(null);

  const dispatch = useDispatch();

  
  const addProduct = (product) => {
    dispatch(addCart(product));  // Thêm sản phẩm vào giỏ hàng
  }

  useEffect(() => {
    const getProductdetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const data = await response.json();
        console.log(data); 
        setProductdetails(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
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
            ${product.price}
          </h3>

          
            <button className="btn btn-outline-dark" onClick={() => addProduct(product)}>
              Add to Cart
            </button>
          

          <NavLink to="/Thanhtoan" >
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                
                dispatch(addCart(product));
              }}
            >
              <i className="fa fa-user me-1">Buy Now</i> 
            </button>
          </NavLink>

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
