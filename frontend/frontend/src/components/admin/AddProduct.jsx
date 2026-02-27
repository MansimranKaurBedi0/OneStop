import { useState } from "react";
import api from "../../services/api";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Product added successfully");

      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Add New Product</h2>

      <form onSubmit={handleSubmit} className="product-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: 0 }}>
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Product Name</label>
          <input
            className="form-input"
            name="name"
            placeholder="e.g. Fresh Apples"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price (₹)</label>
          <input
            className="form-input"
            name="price"
            type="number"
            placeholder="e.g. 150"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Stock Quantity</label>
          <input
            className="form-input"
            name="stock"
            type="number"
            placeholder="e.g. 50"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Category</label>
          <input
            className="form-input"
            name="category"
            placeholder="e.g. Fruits"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Image URL</label>
          <input
            className="form-input"
            name="image"
            placeholder="https://..."
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1", marginTop: "1rem" }}>
          <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
