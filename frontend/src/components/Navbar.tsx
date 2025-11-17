import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  X,
  Home,
  Notebook,
  Code,
  Heart,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown
} from 'lucide-react';
import { cn } from './ui/luxury-card';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '笔记分享', href: '/notes', icon: Notebook },
    { name: '实战项目', href: '/projects', icon: Code },
    { name: '个人生活', href: '/life', icon: Heart },
    { name: '个人主页', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center"
            >
              <Shield size={24} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cyber Security
              </h1>
              <p className="text-xs text-gray-400">数字世界的守护者</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border border-purple-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className={cn("w-5 h-5",
                    "transition-transform duration-300",
                    isActive(item.href) ? "text-purple-400" : "group-hover:scale-110"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl border border-purple-500/30 text-white"
                >
                  <User size={18} />
                  <span className="font-medium">{user.username}</span>
                  <ChevronDown 
                    className={cn("w-4 h-4 transition-transform duration-300", userMenuOpen && "rotate-180")} 
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl"
                    >
                      <div className="py-2">
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5" />
                          <span>管理后台</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>退出登录</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-all duration-300 font-medium"
                  >
                    登录
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    注册
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-white/10 mt-4"
            >
              <div className="py-6 space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300",
                        isActive(item.href)
                          ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}

                {user ? (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">管理后台</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">退出登录</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4 pt-4 border-t border-white/10">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-3 text-center text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium"
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-3 text-center bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-medium transition-all duration-300"
                    >
                      注册
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;