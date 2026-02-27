import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  /* ---------------- FETCH CART ---------------- */

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCart(res.data);
    } catch (err) {
      alert("Failed to load cart");
    }
  };

  /* ---------------- CONTINUE ---------------- */

  const handleContinue = () => {
    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    if (paymentMethod === "COD") {
      setShowAddressForm(true);
    } else {
      alert("Online payment integration pending");
    }
  };

  /* ---------------- PLACE ORDER ---------------- */

  const placeOrder = async () => {
    if (loading) return;

    if (
      !address.name ||
      !address.phone ||
      !address.addressLine ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill complete address");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/orders",
        {
          coinsUsed: coinsToUse, // ✅ correct coins
          paymentMethod,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <h2>Loading checkout...</h2>;

  /* ---------------- COIN CALCULATIONS ---------------- */

  const coinsToUse = useCoins
    ? Math.min(cart.availableCoins, cart.totalAmount)
    : 0;

  const finalTotal = cart.totalAmount - coinsToUse;

  const remainingCoins = cart.availableCoins - coinsToUse;

  /* ---------------- UI ---------------- */

  return (
    <div className="page-wrapper">
      <div className="main-content container">
        <h1 style={{ marginBottom: "2rem" }}>Checkout</h1>

        <div className="flex" style={{ gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* LEFT: Items & Payment/Address */}
          <div style={{ flex: "1 1 60%" }}>
            <div className="card" style={{ marginBottom: "2rem" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>Order Items</h2>
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.125rem" }}>{item.product.name}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ fontWeight: "600" }}>₹ {item.product.price}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: "2rem" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>Payment Options</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  Cash on Delivery
                </label>

                <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                  />
                  Online Payment (Coming Soon)
                </label>
              </div>

              {!showAddressForm && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: "1.5rem" }}
                  onClick={handleContinue}
                >
                  Continue
                </button>
              )}
            </div>

            {showAddressForm && (
              <div className="card">
                <h2 style={{ marginBottom: "1.5rem" }}>Delivery Address</h2>

                <div className="product-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: 0 }}>
                  <div className="form-group">
                    <input
                      className="form-input"
                      placeholder="Full Name"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-input"
                      placeholder="Phone"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    className="form-input"
                    placeholder="Complete Address"
                    value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  />
                </div>

                <div className="product-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: 0 }}>
                  <div className="form-group">
                    <input
                      className="form-input"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-input"
                      placeholder="Pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1rem", padding: "1rem" }}
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Confirm & Place Order"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="card" style={{ flex: "1 1 30%", minWidth: "300px" }}>
            <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>Summary</h2>

            <div className="flex justify-between" style={{ marginBottom: "1rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span style={{ fontWeight: "500" }}>₹ {cart.totalAmount}</span>
            </div>

            <div className="flex justify-between items-center" style={{ marginBottom: "1rem", padding: "1rem", background: "var(--secondary-color)", borderRadius: "var(--radius-md)" }}>
              <div>
                <span style={{ display: "block", fontWeight: "600", color: "var(--primary-color)" }}>Available Coins: {cart.availableCoins}</span>
                <label className="flex items-center gap-2" style={{ cursor: "pointer", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                  <input
                    type="checkbox"
                    checked={useCoins}
                    onChange={() => setUseCoins(!useCoins)}
                  />
                  Use Coins (-₹{useCoins ? coinsToUse : 0})
                </label>
              </div>
            </div>

            <div className="flex justify-between" style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: "600" }}>Final Total</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--success-color)" }}>₹ {finalTotal}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
