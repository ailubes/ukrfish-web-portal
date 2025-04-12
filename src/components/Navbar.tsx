
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Головна", path: "/" },
    { name: "Новини", path: "/news" },
    { name: "Про нас", path: "/about" },
    { name: "Членство", path: "/members" },
    { name: "Контакти", path: "/contacts" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/53d6aaaa-d701-48e1-b151-b1fa9058576c.png"
              alt="UKRFISH Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-700 hover:text-blue-primary transition-colors ${
                  isActive(link.path) ? "font-bold text-blue-primary" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-primary transition-colors"
              >
                <User size={20} className="mr-1" />
                <span>Кабінет</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Увійти
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Зареєструватися
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-3">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-700 hover:text-blue-primary transition-colors ${
                    isActive(link.path) ? "font-bold text-blue-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-primary transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} className="mr-1" />
                <span>Увійти</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
