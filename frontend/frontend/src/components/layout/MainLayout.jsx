import Navbar from "../Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <span className="font-bold text-xl tracking-tight text-slate-900">OneStop<span className="text-primary">Mart</span></span>
              <p className="text-sm text-slate-500 mt-1">Your 10-minute delivery partner.</p>
            </div>
            <div className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} OneStop Mart. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
