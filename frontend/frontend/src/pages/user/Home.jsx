import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");
      setProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ADD TO CART FUNCTION
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/cart/add",
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-content container">
        <div className="flex justify-between items-center" style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0 }}>Fresh Products</h1>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
            <p>No products available right now.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p._id} className="product-card">
                <div className="product-image-placeholder">
                  {p.name.charAt(0).toUpperCase()}
                </div>

                <div className="product-details" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 className="product-title">{p.name}</h3>
                    <div className="product-price" style={{ marginBottom: 0 }}>₹{p.price}</div>
                  </div>

                  <div>
                    <button
                      className={p.stock === 0 ? "btn btn-secondary" : "btn btn-primary"}
                      style={{ padding: "0.75rem 1.5rem" }}
                      disabled={p.stock === 0}
                      onClick={() => addToCart(p._id)}
                    >
                      {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
