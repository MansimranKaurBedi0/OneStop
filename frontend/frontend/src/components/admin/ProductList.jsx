import { useEffect, useState } from "react";
import api from "../../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data); // backend sends { data, pagination }
    } catch (err) {
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/products/${editingProduct._id}`,
        {
          name: editingProduct.name,
          price: editingProduct.price,
          stock: editingProduct.stock,
          category: editingProduct.category,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Product updated");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Manage Products</h2>

      {products.length === 0 && <p style={{ color: "var(--text-muted)" }}>No products found in the database.</p>}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="card flex flex-col justify-between">
            <div>
              <h3 style={{ margin: 0, fontSize: "1.125rem" }}>{product.name}</h3>
              <p style={{ color: "var(--primary-color)", fontWeight: "600", marginTop: "0.25rem", marginBottom: "0.5rem" }}>₹{product.price}</p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", background: "var(--secondary-color)", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-md)" }}>
                  Stock: {product.stock}
                </span>
                <span style={{ fontSize: "0.75rem", background: "var(--secondary-color)", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-md)" }}>
                  Category: {product.category}
                </span>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: "100%" }}
              onClick={() => setEditingProduct(product)}
            >
              Edit Product
            </button>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "2rem" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Edit Product</h3>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  className="form-input"
                  placeholder="Name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (₹)</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Stock</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  placeholder="Category"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                />
              </div>

              <div className="flex gap-4" style={{ marginTop: "1rem" }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
