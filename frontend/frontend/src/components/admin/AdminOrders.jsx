import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ---------- STATUS FLOW ---------- */

  const nextStatusFlow = {
    PLACED: "CONFIRMED",
    CONFIRMED: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
  };

  const statusMap = {
    PLACED: "Confirm Order",
    CONFIRMED: "Dispatch",
    OUT_FOR_DELIVERY: "Mark Delivered",
  };

  const colorMap = {
    PLACED: "gray",
    CONFIRMED: "blue",
    OUT_FOR_DELIVERY: "orange",
    DELIVERED: "green",
  };

  /* ---------- FETCH ORDERS ---------- */

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.data || []);
    } catch (err) {
      console.log("Fetch orders error:", err);
      alert(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------- UPDATE STATUS ---------- */

  const updateStatus = async (order) => {
    const nextStatus = nextStatusFlow[order.status];
    if (!nextStatus) return;

    try {
      await api.put(
        `/admin/orders/${order._id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchOrders(); // refresh list
    } catch (err) {
      console.log("Update error:", err);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  /* ---------- UI STATES ---------- */

  if (loading) return <h2>Loading orders...</h2>;

  if (!orders.length) return <h2>No orders yet</h2>;

  /* ---------- UI ---------- */

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Admin Orders</h2>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order._id} className="card relative">
            <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>Order ID</p>
                <p style={{ margin: 0, fontWeight: "600" }}>{order._id}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>Total</p>
                <p style={{ margin: 0, fontWeight: "700", color: "var(--primary-color)", fontSize: "1.125rem" }}>₹{order.finalAmount}</p>
              </div>
            </div>

            <div className="product-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: 0, marginBottom: "1.5rem" }}>
              <div>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Customer Info</p>
                <p style={{ margin: "0 0 0.25rem", fontWeight: "500" }}>{order.user?.name}</p>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>{order.user?.phone}</p>
              </div>

              <div>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Order Status</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span
                    style={{
                      background: colorMap[order.status] === "green" ? "var(--success-color)"
                        : colorMap[order.status] === "blue" ? "var(--primary-color)"
                          : colorMap[order.status] === "orange" ? "#f59e0b" : "var(--text-muted)",
                      color: "white",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}
                  >
                    {order.status}
                  </span>

                  {/* STATUS BUTTON */}
                  {statusMap[order.status] && (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateStatus(order)}
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                    >
                      {statusMap[order.status]} ➔
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            {order.statusHistory?.length > 0 && (
              <div style={{ background: "var(--secondary-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <p style={{ margin: "0 0 0.75rem", fontWeight: "600", fontSize: "0.875rem" }}>History</p>
                <div className="flex flex-col gap-2 relative" style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border-color)", marginLeft: "0.5rem" }}>
                  {order.statusHistory.map((s, i) => (
                    <div key={i} style={{ fontSize: "0.875rem", position: "relative" }}>
                      <div style={{ position: "absolute", left: "-1.35rem", top: "0.4rem", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--border-color)" }}></div>
                      <span style={{ fontWeight: "500" }}>{s.status}</span>
                      <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>— {new Date(s.date).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
