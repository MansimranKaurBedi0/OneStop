import { useEffect, useState } from "react";
import axios from "axios";

const statusColor = {
  PLACED: "gray",
  CONFIRMED: "blue",
  OUT_FOR_DELIVERY: "orange",
  DELIVERED: "green",
};

export default function MyOrders() {
  const [orders, setOrders] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();

    // live refresh every 5 sec
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!orders) return <h2>Loading orders...</h2>;

  if (orders.length === 0) return <h2>No orders yet</h2>;

  return (
    <div className="page-wrapper">
      <div className="main-content container">
        <h2 style={{ marginBottom: "2rem" }}>My Orders</h2>

        <div className="flex flex-col" style={{ gap: "1.5rem" }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>Order ID</p>
                  <p style={{ margin: 0, fontWeight: "600" }}>{order._id}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>Total</p>
                  <p style={{ margin: 0, fontWeight: "700", color: "var(--primary-color)", fontSize: "1.125rem" }}>₹{order.finalAmount}</p>
                </div>
              </div>

              {/* STATUS BADGE */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    background: statusColor[order.status] === "green" ? "var(--success-color)"
                      : statusColor[order.status] === "blue" ? "var(--primary-color)"
                        : statusColor[order.status] === "orange" ? "#f59e0b" : "var(--text-muted)",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    fontWeight: "600"
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* ITEMS */}
              <div style={{ marginBottom: "1.5rem", background: "var(--secondary-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", fontSize: "0.875rem" }}>Items</p>
                <div className="flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span style={{ fontSize: "0.875rem" }}>{item.name} <span style={{ color: "var(--text-muted)" }}>× {item.quantity}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE */}
              {order.statusHistory?.length > 0 && (
                <div>
                  <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", fontSize: "0.875rem" }}>Timeline</p>
                  <div className="flex flex-col gap-2 relative" style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border-color)", marginLeft: "0.5rem" }}>
                    {order.statusHistory.map((s, i) => (
                      <div key={i} style={{ fontSize: "0.875rem", position: "relative" }}>
                        <div style={{ position: "absolute", left: "-1.35rem", top: "0.4rem", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--primary-color)" }}></div>
                        <span style={{ fontWeight: "500" }}>{s.status}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>{new Date(s.date).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
