import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, NotebookPen, Code, Heart, User, Wrench, Shield, Database, Calculator, Terminal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showToolsDropdown && !target.closest('.tools-dropdown')) {
        setShowToolsDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showToolsDropdown]);

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '笔记分享', href: '/notes', icon: NotebookPen },
    { name: '实战项目', href: '/projects', icon: Code },
    { name: '个人生活', href: '/life', icon: Heart },
    { name: '个人主页', href: '/profile', icon: User },
  ];

  const tools = [
    { name: '恶意软件检测', href: '/tools/malware-scan', icon: Database, description: 'AI驱动的恶意软件检测' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-white/90 backdrop-blur-sm border-b border-stone-200' : 'bg-transparent'}
    `}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-stone-800 rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className={`text-lg font-medium ${scrolled ? 'text-stone-800' : 'text-stone-700'}`}>
              数字随记
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 text-sm font-medium transition-colors
                    ${isActive(item.href) 
                      ? 'text-stone-900 border-b-2 border-stone-900 pb-1' 
                      : scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-stone-500 hover:text-stone-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Tools Dropdown */}
            <div className="relative tools-dropdown">
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className={`
                  flex items-center space-x-2 text-sm font-medium transition-colors
                  ${isActive('/tools') 
                    ? 'text-stone-900 border-b-2 border-stone-900 pb-1' 
                    : scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-stone-500 hover:text-stone-700'
                  }
                `}
              >
                <Wrench className="w-4 h-4" />
                <span>趣味工具</span>
              </button>

              <AnimatePresence>
                {showToolsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50"
                  >
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.name}
                          to={tool.href}
                          onClick={() => setShowToolsDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-stone-500" />
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-xs text-stone-500">{tool.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center text-sm">
                      {String(user.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`text-sm ${scrolled ? 'text-stone-700' : 'text-stone-600'}`}>{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-1.5 text-sm bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-sm transition-colors ${
                scrolled ? 'text-stone-600 hover:text-stone-900' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-stone-200 mt-2">
            <div className="py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-colors
                      ${isActive(item.href)
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Tools Menu */}
              <div className="border-t border-stone-200 mt-3 pt-3">
                <div className="px-3 py-2.5 text-sm font-medium text-stone-600">
                  趣味工具
                </div>
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.name}
                      to={tool.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors rounded-sm"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-stone-200 mt-3 pt-3">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors rounded-sm"
                    >
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs">
                          {String(user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{user.username}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors rounded-sm"
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors rounded-sm"
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-sm bg-stone-900 text-white rounded-sm hover:bg-stone-800 transition-colors"
                    >
                      注册
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;