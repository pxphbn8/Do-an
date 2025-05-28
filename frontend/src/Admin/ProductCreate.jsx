import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc]= useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newProduct = {  title, quantity, price, category, desc, img: image };


    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert(" create successful products");
        navigate("/ManageProducts"); 
      } else {
        alert("Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  const handleCancel = () => {
  navigate("/ManageProducts");
};

  return (
    <div className="product-create-container">
      <h1>Create New Product</h1>
      <form onSubmit={handleSubmit}>
      {/* <div className="mb-3">
          <label>ID</label>
          <input
            type="text"
            className="form-control"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div> */}
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Desc</label>
          <textarea
            type="text"
            className="form-control"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Product</button>
        
      </form>
      <button type="Cancel" className="Cancel" onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default ProductCreate;
