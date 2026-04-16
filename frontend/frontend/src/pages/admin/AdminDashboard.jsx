import { useState } from "react";
import AddProduct from "../../components/admin/AddProduct";
import ProductList from "../../components/admin/ProductList";
import AdminOrders from "../../components/admin/AdminOrders";
import { FiBox, FiShoppingBag, FiPlusCircle } from "react-icons/fi";

const AdminDashboard = () => {
  const [tab, setTab] = useState("products");

  return (
    <div className="max-w-6xl mx-auto animation-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Admin Overview</h1>
          <p className="text-slate-500 mt-1">Manage your catalog, track inventory, and fulfill orders.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-200 w-fit">
        <button
          className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
            tab === "products" ? "bg-primary text-white shadow-sm" : "bg-transparent text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => setTab("products")}
        >
          <FiBox /> Manage Products
        </button>
        <button
          className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
            tab === "orders" ? "bg-primary text-white shadow-sm" : "bg-transparent text-slate-600 hover:bg-slate-50"
          }`}
          onClick={() => setTab("orders")}
        >
          <FiShoppingBag /> Incoming Orders
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {tab === "products" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <FiPlusCircle className="text-primary" /> Add New Product
                 </h2>
               </div>
               <div className="p-6">
                 <AddProduct />
               </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <FiBox className="text-primary" /> Current Inventory
                 </h2>
               </div>
               <div className="p-6">
                 <ProductList />
               </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiShoppingBag className="text-primary" /> Order Management
              </h2>
            </div>
            <div className="p-6 bg-slate-50/50">
              <AdminOrders />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
