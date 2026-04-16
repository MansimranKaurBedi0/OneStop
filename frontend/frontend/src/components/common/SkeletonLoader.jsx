const SkeletonLoader = ({ type = "card", count = 4 }) => {
  const renderSkeletons = () => {
    switch (type) {
      case "card":
        return Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm animate-pulse p-4">
            <div className="w-full h-40 bg-slate-200 rounded-lg mb-4"></div>
            <div className="w-1/3 h-3 bg-slate-200 rounded mb-2"></div>
            <div className="w-full h-4 bg-slate-200 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-slate-200 rounded mb-6"></div>
            <div className="flex justify-between items-end">
              <div className="w-1/4 h-6 bg-slate-200 rounded"></div>
              <div className="w-1/3 h-8 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        ));
      case "list":
        return Array(count).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-xl mb-3 animate-pulse bg-white">
            <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
              <div className="w-1/2 h-3 bg-slate-200 rounded"></div>
            </div>
          </div>
        ));
      case "pills":
        return Array(count).fill(0).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-slate-200 rounded-full animate-pulse border border-slate-100"></div>
        ));
      default:
        return null;
    }
  };

  return <>{renderSkeletons()}</>;
};

export default SkeletonLoader;
