import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiBox } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", phone: "", password: "", address: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password || !formData.address) {
      toast.error("Please fill all fields"); return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg border border-slate-100 flex overflow-hidden flex-row-reverse">
        
        {/* Form Container */}
        <div className="w-full md:w-1/2 p-8 md:p-12 border-l border-slate-100">
          <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
            <div className="w-8 h-8 bg-primary rounded-lg flex justify-center items-center text-white shadow"><FiBox /></div>
            <span className="font-bold text-xl">OneStop<span className="text-primary">Mart</span></span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Create an account</h2>
          <p className="text-slate-500 mb-8 text-sm">Join us today for lightning fast grocery deliveries.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" name="name" placeholder="John Doe" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" name="phone" placeholder="9876543210" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" name="password" placeholder="••••••••" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
              <input className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" name="address" placeholder="123 Street Name" onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center mt-6">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>

        {/* Branding Container */}
        <div className="hidden md:flex w-1/2 bg-accent/10 items-center justify-center p-8 relative overflow-hidden flex-col text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl -tralsate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl translate-y-1/2 -tralsate-x-1/2"></div>
            
            <div className="z-10 relative">
               <img src="https://cdni.iconscout.com/illustration/premium/thumb/online-shopping-4488462-3757303.png" alt="Shopping" className="w-64 h-64 object-contain mb-8 filter drop-shadow-xl" />
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Shop with ease</h3>
               <p className="text-slate-600 max-w-xs mx-auto">Get exclusive offers, manage your orders, and enjoy a seamless ordering experience.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
