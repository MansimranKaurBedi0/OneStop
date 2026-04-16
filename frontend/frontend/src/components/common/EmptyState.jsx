import { FiBox } from "react-icons/fi";
import { Link } from "react-router-dom";

const EmptyState = ({ 
  title = "Nothing to see here", 
  description = "There are no items to display at this moment.", 
  icon = <FiBox size={48} className="text-slate-300" />, 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-8">
        {description}
      </p>
      
      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
