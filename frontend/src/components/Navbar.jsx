import { FileText, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-2 rounded-lg hover:bg-opacity-30 transition">
            <FileText className="text-white" size={24} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white hidden sm:block">AI Resume Analyzer</h1>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Button */}
        <button 
          onClick={() => navigate("/")}
          className="hidden md:block bg-white hover:bg-gray-100 text-primary-600 font-bold px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Upload Resume
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-primary-600 to-primary-700 px-4 py-4 border-t-2 border-white border-opacity-20">
          <button 
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}
            className="w-full bg-white text-primary-600 font-bold py-3 rounded-lg transition-all duration-200 shadow-md active:scale-95"
          >
            Upload Resume
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;