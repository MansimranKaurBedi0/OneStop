import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiChevronRight } from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      setTimeout(async () => {
        try {
          const res = await axios.get("http://localhost:4000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(res.data);
          setLoading(false);
        } catch (e) {
          handleFetchError(e);
        }
      }, 300); // UI visual delay for skeleton
    } catch (err) {
      handleFetchError(err);
    }
  };

  const handleFetchError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    setError(err.response?.data?.message || "Something went wrong");
    setCart({ items: [], totalAmount: 0 });
    setLoading(false);
  }

  const updateQuantity = async (productId, newQty, stock) => {
    if (newQty > stock) {
      toast.warning("Stock limit reached");
      return;
    }
    if (newQty < 1) {
      return removeItem(productId);
    }
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:4000/api/cart/${productId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
             <SkeletonLoader type="list" count={3} />
          </div>
          <div className="lg:w-1/3">
             <SkeletonLoader type="card" count={1} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-red-500 font-bold mb-2">Error</div>
        <div className="text-slate-600">{error}</div>
      </div>
    );
  }

  const hasItems = cart?.items?.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-32 lg:pb-12 h-full">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8 flex items-center gap-2">
        <FiShoppingBag className="text-primary" /> Your Cart
      </h1>

      {!hasItems ? (
        <EmptyState 
          title="Your cart is empty" 
          description="Looks like you haven't added anything to your cart yet." 
          actionText="Browse Products"
          actionLink="/"
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Cart Items List */}
          <div className="lg:w-2/3 space-y-4">
            {cart.items.map((item) => {
              const p = item.product;
              if(!p) return null;
              const imageSrc = p.image || "https://via.placeholder.com/150?text=" + p.name.charAt(0);
              
              return (
                <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center group">
                  {/* Image */}
                  <div className="w-20 h-20 bg-slate-50 flex-shrink-0 rounded-lg flex items-center justify-center p-2 border border-slate-100">
                    <img src={imageSrc} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base mb-1">{p.name}</h3>
                      <div className="text-slate-500 text-sm">₹{p.price} / unit</div>
                    </div>
                    
                    {/* Controls & Amount */}
                    <div className="flex items-center justify-between sm:justify-end sm:gap-6 w-full sm:w-auto">
                      <div className="flex items-center bg-green-50 border border-green-200 rounded-lg w-fit">
                        <button 
                          className="px-3 py-1.5 text-primary hover:bg-green-100 rounded-l-lg transition-colors"
                          onClick={() => updateQuantity(p._id, item.quantity - 1, p.stock)}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-3 font-semibold text-slate-800 w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          className="px-3 py-1.5 text-primary hover:bg-green-100 rounded-r-lg transition-colors disabled:opacity-50"
                          disabled={item.quantity >= p.stock}
                          onClick={() => updateQuantity(p._id, item.quantity + 1, p.stock)}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 min-w-[70px]">
                        <span className="font-bold text-slate-800">₹{p.price * item.quantity}</span>
                        <button 
                          onClick={() => removeItem(p._id)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Billing Details</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="font-medium">₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-800">Grand Total</span>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Inclusive of all taxes</span>
                    <span className="text-xl font-bold text-primary">₹{cart.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Checkout CTA */}
              <button 
                onClick={() => navigate('/checkout')}
                className="hidden lg:flex w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3.5 px-4 font-bold items-center justify-between transition-transform active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                <span>Proceed to Checkout</span>
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Checkout Bottom Bar */}
      {hasItems && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Total to Pay</div>
              <div className="text-lg font-bold text-slate-800">₹{cart.totalAmount}</div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-primary hover:bg-primary-dark active:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
              Checkout <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
