import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ProductEdit.css";

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    quantity: "",
    price: "",
    category: "",
    img: "",   
    desc: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prevProduct => ({
          ...prevProduct,
          img: reader.result, // base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        alert("Update successful product.");
        navigate("/ManageProducts");
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <div className="product-edit-container">
      <h1>Edit Product</h1>
      {loading ? (
        <div>Loading product...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={product.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nhập link ảnh */}
          <div className="mb-3">
            <label>Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="Paste image URL here..."
              value={product.img.startsWith("data:") ? "" : product.img}
              name="img"
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, img: e.target.value }))
              }
            />
          </div>

          {/* Hoặc upload ảnh từ máy */}
          <div className="mb-3">
            <label>Upload Image from Device</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageUpload}
            />
          </div>

          {/* Hiển thị ảnh preview */}
          {product.img && (
            <div className="mb-3">
              <img
                src={product.img}
                alt="Preview"
                style={{ maxWidth: "300px", marginTop: "10px" }}
              />
            </div>
          )}

          <div className="form-group col-12">
            <label>Description</label>
            <textarea
              className="form-control"
              name="desc"
              value={product.desc}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-3">Update Product</button>
        </form>
      )}
    </div>
  );
};

export default ProductEdit;
