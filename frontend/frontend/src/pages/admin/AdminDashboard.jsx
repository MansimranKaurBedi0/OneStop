import { useNavigate } from "react-router-dom";
import AddProduct from "../../components/admin/AddProduct";
import ProductList from "../../components/admin/ProductList";
import AdminOrders from "../../components/admin/AdminOrders";
import { useState } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");

  return (
    <div className="page-wrapper">
      <div className="main-content container">
        <div className="flex justify-between items-center" style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <button className="btn btn-secondary" onClick={() => navigate("/logout")}>
            Logout
          </button>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex gap-4" style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <button
            className={`btn ${tab === "products" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setTab("products")}
          >
            Products
          </button>
          <button
            className={`btn ${tab === "orders" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="card">
          {tab === "products" && (
            <div className="flex flex-col gap-6">
              <AddProduct />
              <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "1rem 0" }} />
              <ProductList />
            </div>
          )}

          {tab === "orders" && <AdminOrders />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
