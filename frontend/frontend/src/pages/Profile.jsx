import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiUser, FiPhone, FiLock, FiSave } from "react-icons/fi";

export default function Profile() {
  const [formData, setFormData] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData({ name: res.data.name, phone: res.data.phone, password: "" });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Only send password if it's not empty
    const payload = { name: formData.name, phone: formData.phone };
    if (formData.password) payload.password = formData.password;

    try {
      await api.put("/auth/profile", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      // Update local storage user generic name if saved
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.name = formData.name;
        u.phone = formData.phone;
        localStorage.setItem("user", JSON.stringify(u));
      }

      toast.success("Profile updated successfully!");
      setFormData({ ...formData, password: "" }); // clear password field
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading profile data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 animation-fade-in relative">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <FiUser className="text-primary" /> Profile Settings
           </h2>
           <p className="text-sm text-slate-500 mt-1">Update your personal information and adjust your security.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FiUser size={18} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-700 outline-none"
                placeholder="Ex. John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FiPhone size={18} />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-700 outline-none"
                placeholder="Ex. 9876543210"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-2">Change Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FiLock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-700 outline-none"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Only fill this if you want to change your password.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2 uppercase tracking-wide mt-4"
          >
            {saving ? "Saving..." : <><FiSave size={18} /> Save Changes</>}
          </button>
        </form>

      </div>
    </div>
  );
}
