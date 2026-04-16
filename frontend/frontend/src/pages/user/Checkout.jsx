import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCheckCircle, FiMapPin, FiCreditCard, FiChevronRight } from "react-icons/fi";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Address, 2 = Payment

  const [address, setAddress] = useState({
    name: "", phone: "", addressLine: "", city: "", pincode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart(res.data);
    } catch (err) {
      toast.error("Failed to load checkout details");
    }
  };

  const placeOrder = async () => {
    if (loading) return;
    if (!address.name || !address.phone || !address.addressLine || !address.city || !address.pincode) {
      toast.error("Please fill your complete address");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/orders",
        { coinsUsed: coinsToUse, paymentMethod, address },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      );
      toast.success("Order placed successfully!");
      navigate(`/order-success/${res.data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const coinsToUse = useCoins ? Math.min(cart.availableCoins, cart.totalAmount) : 0;
  const finalTotal = cart.totalAmount - coinsToUse;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 mb-8 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Secure Checkout</h1>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={step === 1 ? "text-primary" : "text-green-600"}><FiMapPin className="inline mr-1"/> Address</span>
            <span className="text-slate-300">--</span>
            <span className={step === 2 ? "text-primary" : "text-slate-400"}><FiCreditCard className="inline mr-1"/> Payment</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Form Areas */}
        <div className="md:w-2/3 space-y-6">
          
          {/* Step 1: Address */}
          <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300`}>
            <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
              Delivery Address
            </div>
            {step === 1 ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John Doe" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="9876543210" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address</label>
                  <input className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="House/Flat No, Building, Street" value={address.addressLine} onChange={e => setAddress({...address, addressLine: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                    <input className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                  </div>
                </div>
                <div className="pt-2">
                  <button onClick={() => {
                    if(!address.name || !address.phone || !address.addressLine || !address.city || !address.pincode){
                      toast.error("Please fill all address fields"); return;
                    }
                    setStep(2);
                  }} className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl w-full sm:w-auto shadow-sm active:scale-95 transition-transform">
                    Deliver Here
                  </button>
                </div>
              </div>
            ) : (
                <div className="p-4 flex justify-between items-center text-sm">
                   <div className="text-slate-600">
                     <span className="font-semibold text-slate-800">{address.name}</span> - {address.addressLine}, {address.city} - {address.pincode}
                   </div>
                   <button onClick={() => setStep(1)} className="text-primary font-medium hover:underline">Change</button>
                </div>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
              Payment Method
            </div>
            {step === 2 && (
              <div className="p-6 space-y-4">
                <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-primary/50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-slate-300'}`}>
                         {paymentMethod === 'COD' && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <span className="font-medium text-slate-800">Cash on Delivery</span>
                    </div>
                  </div>
                </label>
                <label className={`block border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-primary/50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-primary' : 'border-slate-300'}`}>
                         {paymentMethod === 'ONLINE' && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <span className="font-medium text-slate-800">Online Payment / UPI <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">Testing</span></span>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Summary */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-32">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Order Summary</h2>
            
            <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
              {cart.items.map(item => (
                <div key={item.product._id} className="flex justify-between text-sm">
                   <div className="text-slate-600 truncate max-w-[150px]"><span className="font-medium">{item.quantity}x</span> {item.product.name}</div>
                   <div className="font-medium text-slate-800">₹{item.product.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-4 bg-slate-50 p-3 rounded-lg">
               <div className="flex items-start justify-between">
                 <div>
                   <div className="font-bold text-primary flex items-center gap-1"><FiCheckCircle /> Coins Available</div>
                   <div className="text-xs text-slate-500 mt-0.5">Balance: {cart.availableCoins} coins</div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={useCoins} onChange={() => setUseCoins(!useCoins)} />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
               </div>
               {useCoins && (
                 <div className="flex justify-between text-sm text-green-600 font-medium pt-2 border-t border-slate-200">
                   <span>Coins Used</span>
                   <span>-₹{coinsToUse}</span>
                 </div>
               )}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>₹{cart.totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Delivery</span>
                <span className="text-primary font-medium">FREE</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t border-slate-100 pt-4 mb-6">
              <span className="font-bold text-slate-800">To Pay</span>
              <span className="text-xl font-bold text-slate-900">₹{finalTotal}</span>
            </div>

            <button 
              onClick={placeOrder}
              disabled={loading || step !== 2}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-bold flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
