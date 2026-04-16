import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiBox, FiUsers, FiShoppingBag, FiLogOut, FiMenu } from "react-icons/fi";
import { useState } from "react";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-sm z-30 transform transition-transform duration-300 md:transform-none flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <FiBox size={18} />
            </div>
            Admin<span className="text-primary">Panel</span>
          </h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive("/admin/dashboard") 
                ? "bg-primary/10 text-primary" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <FiHome size={20} /> Dashboard
          </Link>
          {/* Future admin links can go here (Users, Products, Orders) */}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => navigate('/logout')} 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors font-medium"
          >
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white shrink-0 border-b border-slate-200 flex items-center px-4 md:px-8 justify-between shadow-sm z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <FiMenu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-300">
              <FiUsers size={18} />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
