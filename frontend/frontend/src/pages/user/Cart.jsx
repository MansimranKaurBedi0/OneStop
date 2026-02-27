import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  /* ---------------- FETCH CART ---------------- */

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(err.response?.data?.message || "Something went wrong");
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE QUANTITY ---------------- */

  const updateQuantity = async (productId, newQty, stock) => {
    if (newQty > stock) {
      alert("Stock limit reached");
      return;
    }

    if (newQty < 1) {
      return removeItem(productId);
    }

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:4000/api/cart/${productId}`,
        { quantity: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:4000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart();
    } catch (err) {
      alert("Remove failed");
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading) return <h2>Loading cart...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="page-wrapper">
      <div className="main-content container">
        <h1 style={{ marginBottom: "2rem" }}>Your Cart</h1>

        {cart?.items?.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "1.125rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Your cart is empty.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex" style={{ gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 60%" }}>
              {cart?.items?.map((item) => (
                <div key={item.product?._id} className="card flex items-center justify-between" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{item.product?.name}</h3>
                    <p style={{ color: "var(--primary-color)", fontWeight: "600", marginTop: "0.25rem", marginBottom: "1rem" }}>₹ {item.product?.price}</p>
                    <p style={{ fontSize: "0.875rem", margin: 0, fontWeight: "500" }}>
                      Subtotal: ₹ {item.product?.price * item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2" style={{ background: "var(--secondary-color)", borderRadius: "var(--radius-md)", padding: "0.25rem" }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.75rem", background: "transparent" }}
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.product.stock)}
                      >
                        −
                      </button>

                      <span style={{ fontWeight: "600", minWidth: "1.5rem", textAlign: "center" }}>{item.quantity}</span>

                      <button
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.75rem", background: "transparent" }}
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.product.stock)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger"
                      style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                      onClick={() => removeItem(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ flex: "1 1 30%", minWidth: "300px" }}>
              <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>Order Summary</h2>

              <div className="flex justify-between" style={{ marginBottom: "1rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span style={{ fontWeight: "500" }}>₹ {cart?.totalAmount}</span>
              </div>

              <div className="flex justify-between" style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)", marginBottom: "2rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: "600" }}>Total</span>
                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--primary-color)" }}>₹ {cart?.totalAmount}</span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "1rem", fontSize: "1.125rem" }}
                disabled={!cart?.items?.length}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
