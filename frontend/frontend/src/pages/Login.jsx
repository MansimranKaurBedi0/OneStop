import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiBox } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please enter both phone and password"); return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { phone, password, loginType });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      
      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg border border-slate-100 flex overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
            <div className="w-8 h-8 bg-primary rounded-lg flex justify-center items-center text-white shadow"><FiBox /></div>
            <span className="font-bold text-xl">OneStop<span className="text-primary">Mart</span></span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8">Enter your details to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="Ex. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="flex gap-4 pt-2">
              <label className={`flex-1 border text-center rounded-xl py-3 cursor-pointer transition-colors font-medium text-sm ${loginType === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" className="hidden" checked={loginType === "user"} onChange={() => setLoginType("user")} />
                User Login
              </label>
              <label className={`flex-1 border text-center rounded-xl py-3 cursor-pointer transition-colors font-medium text-sm ${loginType === 'admin' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" className="hidden" checked={loginType === "admin"} onChange={() => setLoginType("admin")} />
                Admin
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center mt-4">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </div>

        {/* Right Side: Image/Branding (Hidden on mobile) */}
        <div className="hidden md:block w-1/2 p-2">
          <div className="h-full w-full bg-primary/10 rounded-xl border border-primary/20 overflow-hidden relative flex flex-col items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/food.png')] bg-opacity-20">
             <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl text-center z-10 max-w-sm">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBox className="text-primary text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Groceries in minutes</h3>
                <p className="text-slate-600 text-sm">Experience the fastest delivery service in your area. Fresh products, 100% quality guaranteed.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
