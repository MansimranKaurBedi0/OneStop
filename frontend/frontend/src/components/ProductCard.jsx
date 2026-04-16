import { FiShoppingCart, FiPlus } from "react-icons/fi";

const ProductCard = ({ product, onAdd, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
        <div className="w-full h-48 bg-slate-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-8 bg-slate-200 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  // Handle placeholders safely
  const imageSrc = product.image || "https://via.placeholder.com/400x400?text=OneStop";

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative flex flex-col h-full">

      {/* Image Wrapper */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs font-medium text-slate-500 mb-1">{product.category || "General"}</div>
        <h3 className="font-semibold text-slate-800 text-sm md:text-base leading-snug line-clamp-2 h-10 md:h-12 mb-2">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="font-bold text-lg text-slate-900">₹{product.price}</div>
          </div>
          
          <button 
            onClick={() => onAdd && onAdd(product)}
            className="flex items-center justify-center gap-1 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors border border-primary/20 hover:border-primary px-3 py-1.5 rounded-lg font-semibold text-sm active:scale-95"
          >
            ADD <FiPlus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
