import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/common/EmptyState";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import { FiClock, FiShield, FiTrendingUp } from "react-icons/fi";

const CATEGORIES = [
  { id: 0, name: "All", icon: "✨", color: "bg-slate-100", border: "border-slate-200" },
  { id: 1, name: "Fresh Veggies", icon: "🥦", color: "bg-green-100", border: "border-green-200" },
  { id: 2, name: "Fruits", icon: "🍎", color: "bg-red-100", border: "border-red-200" },
  { id: 3, name: "Dairy & Eggs", icon: "🥛", color: "bg-blue-100", border: "border-blue-200" },
  { id: 4, name: "Bakery", icon: "🍞", color: "bg-yellow-100", border: "border-yellow-200" },
  { id: 5, name: "Snacks", icon: "🍿", color: "bg-orange-100", border: "border-orange-200" },
  { id: 6, name: "Beverages", icon: "🥤", color: "bg-purple-100", border: "border-purple-200" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/products");
      // Simulate slight network delay for skeleton demo if it's too fast locally
      setTimeout(() => {
        setProducts(res.data.data);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to add items to cart");
      return;
    }

    if (product.stock === 0) {
      toast.warning("This item is out of stock!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/cart/add",
        { productId: product._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl text-center md:text-left">
            <h1 className="text-3xl md:text-5xl border-none m-0 p-0 font-bold mb-4 tracking-tight text-white leading-tight">
              Groceries delivered in <span className="text-yellow-300">minutes.</span>
            </h1>
            <p className="text-primary-100 text-lg mb-6 opacity-90">
              Fresh produce, daily essentials, and snacks straight to your door without the wait.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-sm">
                <FiClock /> 10 Min Delivery
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-sm">
                <FiShield /> 100% Quality
              </div>
            </div>
          </div>
          <div className="hidden md:block w-72 h-48 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center p-6 shadow-lg backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/grocery-delivery-4268366-3560995.png" alt="Delivery Hero" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 m-0">Shop by Category</h2>
          </div>
          <div className="relative overflow-hidden w-full pb-6 group">
            <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
            
            <div className="flex gap-8 md:gap-12 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...CATEGORIES, ...CATEGORIES].map((cat, i) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <div 
                    key={`${cat.id}-${i}`} 
                    className="shrink-0 flex flex-col items-center gap-2 cursor-pointer w-24"
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <div className={`w-20 h-20 rounded-2xl ${cat.color} ${cat.border} border flex items-center justify-center text-4xl shadow-sm transition-all duration-300 ${isActive ? "ring-2 ring-primary ring-offset-2 scale-105" : "hover:scale-105 hover:shadow-md"}`}>
                      {cat.icon}
                    </div>
                    <span className={`text-xs font-semibold text-center transition-colors ${isActive ? "text-primary" : "text-slate-700 hover:text-primary"}`}>
                      {cat.name === "All" ? "All Products" : cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trending / Featured Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">
              <FiTrendingUp className="text-primary" /> Trending Now
            </h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              <SkeletonLoader type="card" count={5} />
            </div>
          ) : products.length === 0 ? (
            <EmptyState 
              title="We're restocking!" 
              description="Our fresh goods ran out surprisingly fast. Please check back soon." 
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products
                .filter(p => selectedCategory === "All" || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()))
                .map((p) => (
                <ProductCard 
                  key={p._id} 
                  product={p} 
                  onAdd={addToCart} 
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
