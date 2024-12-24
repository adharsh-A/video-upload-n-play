import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, Film, Menu, X, Github } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, icon: Icon, children, external }) => (
    <Link
      to={to}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : ""}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActivePath(to)
          ? 'bg-blue-500/10 text-blue-400'
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-white"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span>VideoHub</span>
          </Link>
        
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" icon={Upload}>
              Upload
            </NavLink>
            <NavLink to="/videos" icon={Film}>
              Videos
            </NavLink>
            <NavLink to="https://github.com/adharsh-a" icon={Github} external>
              GitHub
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <NavLink to="/" icon={Upload}>
              Upload
            </NavLink>
            <NavLink to="/videos" icon={Film}>
              Videos
            </NavLink>
            <NavLink to="https://github.com/adharsh-a" icon={Github} external>
              GitHub
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;    