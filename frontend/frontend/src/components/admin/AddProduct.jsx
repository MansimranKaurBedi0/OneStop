import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.price || !formData.stock || !formData.category){
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      await api.post("/products", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product added successfully");
      setFormData({ name: "", price: "", stock: "", category: "", image: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Name <span className="text-red-500">*</span></label>
          <input className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" name="name" placeholder="e.g. Fresh Apples" value={formData.name} onChange={handleChange} />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) <span className="text-red-500">*</span></label>
           <input className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" name="price" type="number" placeholder="e.g. 150" value={formData.price} onChange={handleChange} />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
           <input className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" name="stock" type="number" placeholder="e.g. 50" value={formData.stock} onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
           <input className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" name="category" placeholder="e.g. Fruits" value={formData.category} onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
           <input className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400" name="image" placeholder="https://..." value={formData.image} onChange={handleChange} />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
