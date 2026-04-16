import { useEffect, useState } from "react";
import axios from "axios";
import { FiBox, FiClock, FiCheckCircle, FiTruck, FiList, FiPackage } from "react-icons/fi";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";

const statusColor = {
  PLACED: "bg-slate-100 text-slate-600 border-slate-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700 border-amber-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
};

const statusIcon = {
  PLACED: <FiClock size={14} />,
  CONFIRMED: <FiCheckCircle size={14} />,
  OUT_FOR_DELIVERY: <FiTruck size={14} />,
  DELIVERED: <FiPackage size={14} />,
};

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.data.reverse()); // latest first
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10s is better than 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <FiList className="text-primary" /> My Orders
        </h1>

        {loading ? (
          <SkeletonLoader type="list" count={5} />
        ) : !orders || orders.length === 0 ? (
          <EmptyState 
            title="No orders yet" 
            description="You haven't placed an order. Order some fresh products today!"
            actionText="Start Shopping"
            actionLink="/"
            icon={<FiBox size={48} className="text-slate-300" />}
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 py-3 px-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-slate-700">{order._id}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Amount Paid</p>
                    <p className="font-bold text-lg text-slate-900 leading-tight">₹{order.finalAmount}</p>
                  </div>
                </div>

                <div className="p-5 sm:px-6 flex flex-col md:flex-row gap-8">
                  {/* Items List */}
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-3">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                         <FiShoppingBag /> Items List
                       </h3>
                       <div className={`px-3 py-1 flex items-center gap-1.5 rounded-full border text-xs font-bold ${statusColor[order.status]}`}>
                         {statusIcon[order.status]} {order.status.replace(/_/g, ' ')}
                       </div>
                     </div>
                     <div className="border border-slate-100 rounded-xl divide-y divide-slate-100">
                       {order.items.map((item, i) => (
                          <div key={i} className="py-3 px-4 flex justify-between items-center bg-white last:rounded-b-xl first:rounded-t-xl hover:bg-slate-50 transition-colors">
                            <span className="font-medium text-sm text-slate-700">{item.name}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-sm font-medium text-slate-400">Qty:</span>
                               <span className="bg-slate-100 text-slate-700 w-6 h-6 flex items-center justify-center rounded-md font-bold text-xs">{item.quantity}</span>
                            </div>
                          </div>
                       ))}
                     </div>
                  </div>

                  {/* Timeline */}
                  {order.statusHistory?.length > 0 && (
                    <div className="md:w-64 shrink-0">
                      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FiClock /> Timeline
                      </h3>
                      <div className="relative border-l border-slate-200 ml-3 space-y-4">
                        {order.statusHistory.map((s, i) => {
                          const isLast = i === order.statusHistory.length - 1;
                          return (
                            <div key={i} className="relative pl-5">
                              <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ring-4 ring-white ${isLast ? 'bg-primary' : 'bg-slate-300'}`}></div>
                              <p className={`text-sm font-bold ${isLast ? 'text-slate-800' : 'text-slate-500'}`}>{s.status.replace(/_/g, ' ')}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
