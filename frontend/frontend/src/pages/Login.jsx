import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user"); // 🔹 added

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        phone,
        password,
        loginType, // 🔹 sent to backend
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔹 role-based routing
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🔹 login type selector */}
          <div className="form-group flex justify-center gap-4" style={{ marginBottom: "1.5rem" }}>
            <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.875rem" }}>
              <input
                type="radio"
                value="user"
                checked={loginType === "user"}
                onChange={() => setLoginType("user")}
              />
              User
            </label>

            <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.875rem" }}>
              <input
                type="radio"
                value="admin"
                checked={loginType === "admin"}
                onChange={() => setLoginType("admin")}
              />
              Admin
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "1rem" }}>
            Login
          </button>

          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "500" }}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
