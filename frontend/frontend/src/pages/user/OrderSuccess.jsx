import { useParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiShoppingBag } from "react-icons/fi";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center animate-fade-in">
        
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50">
          <FiCheckCircle size={48} />
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Placed!</h1>
        <p className="text-slate-500 mb-8 border-b border-slate-100 pb-6">
          Your order has been placed successfully and is being processed by our team.
        </p>

        <div className="bg-slate-50 p-4 rounded-xl mb-8 flex flex-col items-center gap-1 border border-slate-100">
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <FiPackage /> Order ID
          </p>
          <h3 className="text-lg font-bold text-slate-800 tracking-wide">{id}</h3>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2" 
            onClick={() => navigate("/")}
          >
            <FiShoppingBag /> Continue Shopping
          </button>
          <button 
            className="w-full bg-white text-slate-700 hover:bg-slate-50 font-bold py-3.5 px-4 rounded-xl transition-all border border-slate-200 active:scale-95" 
            onClick={() => navigate("/my-orders")}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
