import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="address"
              placeholder="Delivery Address"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem", marginBottom: "1rem" }}>
            Sign Up
          </button>

          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "500" }}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
