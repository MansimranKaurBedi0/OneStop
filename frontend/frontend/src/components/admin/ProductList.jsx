import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FiEdit2, FiX } from "react-icons/fi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data.reverse()); // latest first
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/products/${editingProduct._id}`,
        {
          name: editingProduct.name,
          price: editingProduct.price,
          stock: editingProduct.stock,
          category: editingProduct.category,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12 text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div> Loading Inventory...
    </div>
  );

  return (
    <div>
      {products.length === 0 && <p className="text-slate-500 py-8 text-center italic">No products found in the database.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-primary/30 hover:shadow-sm transition-all group">
            <div className="mb-4">
               {product.stock <= 5 && product.stock > 0 && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2">Low Stock</span>}
               {product.stock === 0 && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-2">Out of Stock</span>}

               <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 line-clamp-2" title={product.name}>{product.name}</h3>
               <p className="font-bold text-lg text-primary mb-3">₹{product.price}</p>

               <div className="flex gap-2flex-wrap mt-auto">
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded truncate flex-1 font-medium text-center border border-slate-200">
                   Stock: {product.stock}
                 </span>
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded truncate flex-1 font-medium text-center border border-slate-200">
                   {product.category}
                 </span>
               </div>
            </div>

            <button
              className="w-full py-2 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-600 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white"
              onClick={() => setEditingProduct(product)}
            >
              <FiEdit2 size={14} /> Edit
            </button>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in border border-slate-100">
             
             <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
               <h3 className="text-lg font-bold text-slate-800">Quick Edit Product</h3>
               <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-md border border-slate-200 shadow-sm"><FiX size={20}/></button>
             </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
