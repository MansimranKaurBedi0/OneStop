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
import Profile from "./pages/Profile";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
        <Route path="/order-success/:id" element={<MainLayout><OrderSuccess /></MainLayout>} />
        <Route path="/my-orders" element={<MainLayout><MyOrders /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />

        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/profile" element={<AdminLayout><Profile /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
