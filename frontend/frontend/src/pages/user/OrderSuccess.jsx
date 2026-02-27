import { useParams, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-wrapper" style={{ background: "var(--secondary-color)", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "500px", width: "100%", textAlign: "center", padding: "3rem" }}>
        <div style={{ width: "80px", height: "80px", background: "var(--success-color)", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", margin: "0 auto 1.5rem" }}>
          ✓
        </div>

        <h1 style={{ color: "var(--success-color)", marginBottom: "1rem" }}>Order Placed!</h1>

        <div style={{ background: "var(--secondary-hover)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>Order ID</p>
          <h3 style={{ margin: 0, fontSize: "1.125rem" }}>{id}</h3>
        </div>

        <p style={{ marginBottom: "2rem", color: "var(--text-muted)" }}>Your order has been placed successfully and is being processed by our team.</p>

        <button className="btn btn-primary" style={{ width: "100%", padding: "1rem" }} onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};


export default OrderSuccess;
