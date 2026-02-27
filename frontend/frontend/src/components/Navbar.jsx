import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiBox } from "react-icons/fi"; // npm package react-icons is already in package.json

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Simple auth check

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiBox size={24} color="var(--primary-color)" />
          LocalMart
        </Link>

        <div className="navbar-links">
          {token ? (
            <>
              <Link to="/my-orders" className="navbar-link">
                My Orders
              </Link>
              <Link to="/cart" className="navbar-link cart-icon">
                <FiShoppingCart size={20} />
                <span>Cart</span>
              </Link>
              <div
                className="navbar-link"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/logout")}
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                <FiUser size={20} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
