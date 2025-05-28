import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./ManageProducts.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        console.log("Fetched products:", data);  // Debug xem API trả gì

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.warn("API không trả về một mảng sản phẩm hợp lệ.");
          setProducts([]);  // fallback để tránh lỗi .map
        }
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter(product => (product.id || product._id) !== productId));
      } else {
        alert("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const editProduct = (productId) => {
    navigate(`/ProductEdit/${productId}`);
  };

  return (
    <div className="manage-products-container">
      <h1>Manage Your Products</h1>
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <>
          <div className="buttons mb-3">
            <NavLink to="/ProductCreate" className="btn btn-primary">
              Add New Product
            </NavLink>
          </div>

          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const productId = product.id || product._id; // hỗ trợ cả hai kiểu
                  return (
                    <tr key={productId}>
                      <td>{productId}</td>
                      <td>{product.title}</td>
                      <td>{product.quantity}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <button
                          onClick={() => editProduct(productId)}
                          className="btn btn-warning me-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(productId)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="mt-4 text-end">
            <NavLink to="/Admin" className="btn btn-secondary">
              Back to Admin
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;
