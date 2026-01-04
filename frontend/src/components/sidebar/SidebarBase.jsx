

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink,useNavigate } from 'react-router-dom';
import { BrainCircuit, X, Settings, LogOut, Sun, Moon, ChevronRight } from 'lucide-react';
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const SidebarBase = ({ navItems, isOpen, toggleSidebar }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const menuRef = useRef(null);
  const toast = useToast();

  const { setAuth } = useAuth(); 
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
      // 1. Tell server to delete cookie
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true 
      });

      // 2. Clear app state
      setAuth({ user: null, accessToken: null, role: null });
      toast.success("Successfully logged out")
      // 3. Go to login page
      navigate("/");
      
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to logout")
    }
  };

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-card)] lg:bg-[var(--bg-main)]/50 backdrop-blur-xl
        border-r border-[var(--border-subtle)] transition-transform duration-300 lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <span className="font-black tracking-tighter text-xl uppercase text-[var(--text-main)]">
                Upskillr
              </span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-[var(--text-muted)]">
              <X size={24} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => toggleSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full p-3.5 rounded-xl transition-all
                  ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-input)]'
                  }`
                }
              >
                <div className={({ isActive }) => isActive ? 'text-emerald-600' : ''}>
                    {item.icon}
                </div>
                <span className="font-bold text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            {/* SETTINGS DROPDOWN WRAPPER */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                  isSettingsOpen 
                    ? 'bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border-subtle)]' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-input)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings 
                    size={20} 
                    className={isSettingsOpen ? 'rotate-90 transition-transform duration-500 text-emerald-500' : ''} 
                  />
                  <span className="font-bold text-sm">Settings</span>
                </div>
                <ChevronRight 
                  size={14} 
                  className={`transition-transform duration-300 ${isSettingsOpen ? 'rotate-90' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 w-full mb-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                  >
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-between w-full p-3 hover:bg-[var(--bg-input)] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? (
                          <Sun size={18} className="text-amber-500" />
                        ) : (
                          <Moon size={18} className="text-blue-500" />
                        )}
                        <span className="text-[12px] font-black text-[var(--text-main)] uppercase tracking-tight">
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                      </div>
                      <div className="w-8 h-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-full relative">
                        <motion.div 
                          animate={{ x: theme === 'dark' ? 2 : 18 }}
                          className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${theme === 'dark' ? 'bg-amber-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LOGOUT BUTTON */}
            <button onClick={handleLogout} className="group flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-500/10 rounded-xl mt-2 transition-colors">
              <LogOut
                size={20}
                className="transition-transform duration-500 group-hover:rotate-180"
              />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarBase;