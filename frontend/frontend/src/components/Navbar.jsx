import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiBox, FiMenu, FiX, FiList } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Simple auth check
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Hardcode dummy cart count for visual. Normally from context/redux
  const cartItemCount = 2; 

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow">
              <FiBox size={20} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-800">OneStop<span className="text-primary">Mart</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {token ? (
              <div className="flex items-center space-x-6">
                <Link to="/cart" className="relative text-slate-600 hover:text-primary transition-colors flex items-center gap-1.5 group font-medium">
                  <div className="relative">
                    <FiShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>
                
                <div className="relative relative-profile">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:border-primary transition-colors">
                      <FiUser size={18} />
                    </div>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in origin-top-right">
                      <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                        <FiList size={16} /> My Orders
                      </Link>
                      <button onClick={() => { setProfileOpen(false); navigate('/logout'); }} className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors">
                  <FiUser size={18} /> Login
                </Link>
                <Link to="/signup" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow-md active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {token && (
               <Link to="/cart" className="relative text-slate-600 hover:text-primary transition-colors flex items-center group">
                 <div className="relative">
                   <FiShoppingCart size={24} className="transition-transform group-active:scale-95" />
                   {cartItemCount > 0 && (
                     <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                       {cartItemCount}
                     </span>
                   )}
                 </div>
               </Link>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-slate-600 hover:text-primary focus:outline-none p-1"
            >
              {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 transition-all duration-300 ease-in-out shadow-lg ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {token ? (
            <>
              <Link to="/my-orders" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3.5 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                <FiList size={20} /> My Orders
              </Link>
              <button 
                onClick={() => { closeMenu(); navigate('/logout'); }} 
                className="flex items-center gap-3 w-full text-left px-3 py-3.5 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3.5 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                <FiUser size={20} /> Login
              </Link>
              <Link to="/signup" onClick={closeMenu} className="flex justify-center w-full mt-3 bg-primary text-white px-4 py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
