import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Logout from "./pages/Logout";
import Home from "./pages/user/Home";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./pages/user/OrderSuccess";
import MyOrders from "./pages/user/MyOrder";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />

        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
