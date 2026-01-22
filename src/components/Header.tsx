import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { Menu, X, Moon, Sun, ShoppingCart, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${isScrolled
      ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
      : 'bg-transparent'
      }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <div className="flex items-center group">
            <Link to="/" className="flex items-center space-x-2 transform transition-all duration-300 hover:scale-105">
              <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                <ShoppingCart className="h-5 w-5 text-white transform transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-teal-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-teal-600 transition-all duration-300">
                Zentra
              </span>
              <Sparkles className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 relative">
            {/* Animated background indicator */}
            <div className="absolute inset-0 flex items-center">
              <div className={`h-8 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full transition-all duration-300 ${activeItem ? 'opacity-100' : 'opacity-0'
                }`} style={{
                  width: activeItem ? '80px' : '0px',
                  transform: `translateX(${navItems.findIndex(item => item.name === activeItem) * 100}px)`
                }} />
            </div>

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group z-10"
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem('')}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:rotate-12 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {isDarkMode ? (
                <Sun className="h-4 w-4 relative z-10 transform transition-transform duration-300 group-hover:rotate-180" />
              ) : (
                <Moon className="h-4 w-4 relative z-10 transform transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            <Link
              to="/login"
              className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 group overflow-hidden rounded-lg"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link
              to="/signup"
              className="relative px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group overflow-hidden"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:rotate-12 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {isDarkMode ? (
                <Sun className="h-4 w-4 relative z-10 transform transition-transform duration-300 group-hover:rotate-180" />
              ) : (
                <Moon className="h-4 w-4 relative z-10 transform transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {isMenuOpen ? (
                <X className="h-5 w-5 relative z-10 transform transition-transform duration-300 rotate-0 group-hover:rotate-90" />
              ) : (
                <Menu className="h-5 w-5 relative z-10 transform transition-transform duration-300 group-hover:rotate-180" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-t border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/20 dark:hover:to-teal-900/20 rounded-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-2 group relative overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isMenuOpen ? 'slideUp 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute left-0 top-1/2 w-1 h-0 bg-gradient-to-b from-blue-500 to-teal-500 group-hover:h-full group-hover:top-0 transition-all duration-300 rounded-r" />
                </a>
              ))}
              <div className="pt-4 pb-2 space-y-2 border-t border-gray-200/50 dark:border-gray-700/50 mt-4">
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 dark:hover:from-blue-900/20 dark:hover:to-teal-900/20 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 group relative overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  to="/signup"
                  className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 group relative overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;