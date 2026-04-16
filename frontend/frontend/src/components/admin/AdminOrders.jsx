import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FiChevronRight, FiUser, FiPhone, FiTrash2 } from "react-icons/fi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const nextStatusFlow = { PLACED: "CONFIRMED", CONFIRMED: "OUT_FOR_DELIVERY", OUT_FOR_DELIVERY: "DELIVERED" };
  const statusMap = { PLACED: "Confirm Order", CONFIRMED: "Dispatch Order", OUT_FOR_DELIVERY: "Mark Delivered" };

  const colorMap = {
    PLACED: "bg-slate-100 text-slate-600 border-slate-200",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
    OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700 border-amber-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
  };

  const fetchOrders = async (pageNum = page) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/orders?page=${pageNum}&limit=8`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data.data ? res.data.data : []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const updateStatus = async (order) => {
    const nextStatus = nextStatusFlow[order.status];
    if (!nextStatus) return;
    try {
      await api.put(`/admin/orders/${order._id}/status`, { status: nextStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Order marked as ${nextStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this completed order?")) return;
    try {
      await api.delete(`/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Order deleted");
      if (orders.length === 1 && page > 1) setPage(page - 1);
      else fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400 font-medium">Loading orders stream...</div>;
  if (!orders.length) return <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-xl border border-slate-200 border-dashed">No incoming orders.</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
      {orders.map((order) => (
        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Order #{order._id.substring(order._id.length-6)}</p>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border uppercase ${colorMap[order.status]}`}>
                {order.status.replace(/_/g, " ")}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Amount</p>
              <p className="text-lg font-bold text-primary leading-none">₹{order.finalAmount}</p>
            </div>
          </div>

          <div className="p-5 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Customer Details</p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-slate-300 w-fit">
                    <FiUser className="text-slate-400"/> {order.user?.name || "Guest"}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-slate-300 w-fit">
                    <FiPhone className="text-slate-400"/> {order.user?.phone || "No Phone"}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Items</p>
                <div className="text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-24 overflow-y-auto scrollbar-thin">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-slate-100 last:border-0 py-1 first:pt-0 last:pb-0">
                         <span>{item.quantity}x {item.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="sm:w-48 shrink-0 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Action Required</p>
                {statusMap[order.status] ? (
                  <button
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-3 rounded-xl transition-all shadow-sm active:scale-95 text-xs flex justify-between items-center uppercase tracking-wide"
                    onClick={() => updateStatus(order)}
                  >
                    <span>{statusMap[order.status]}</span>
                    <FiChevronRight size={14} />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 bg-green-50 border border-green-100 text-green-700 font-bold py-2.5 px-3 rounded-xl text-xs text-center uppercase tracking-wide">
                      Fulfilled
                    </div>
                    <button 
                      onClick={() => deleteOrder(order._id)}
                      className="bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 py-2.5 px-3 rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center"
                      title="Archive / Remove Order"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                 <p className="text-[10px] text-slate-400 font-medium">Last updated:</p>
                 <p className="text-xs font-semibold text-slate-600">
                   {order.statusHistory?.length ? new Date(order.statusHistory[order.statusHistory.length-1].date).toLocaleTimeString() : 'N/A'}
                 </p>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 pb-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Previous
          </button>
          <span className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
