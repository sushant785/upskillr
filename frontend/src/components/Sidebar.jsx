import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Search, BookCheck, LineChart, 
  MessageSquare, UserCircle, Settings, LogOut, 
  BrainCircuit, X 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
    const navItems = [
    { path: '/learner-dashboard', icon: <LayoutDashboard size={20}/>, label: "Dashboard" },
    { path: '/browse', icon: <Search size={20}/>, label: "Browse Courses" },
    { path: '/courses', icon: <BookCheck size={20}/>, label: "My Courses" },
    { path: '/progress', icon: <LineChart size={20}/>, label: "Progress" },
    { path: '/feedback', icon: <MessageSquare size={20}/>, label: "Feedback" },
    { path: '/profile', icon: <UserCircle size={20}/>, label: "Profile" },
  ];
  return (
    <>
      {/* --- Mobile Overlay --- */}
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

      {/* --- Sidebar Content --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-main)]/50 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <span className="font-black tracking-tighter text-xl uppercase italic">Upskillr</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400">
              <X size={24} />
            </button>
          </div>

         
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => toggleSidebar(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 w-full p-3.5 rounded-xl transition-all group
                  ${isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5'}
                `}
              >
                {item.icon}
                <span className="font-bold text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <NavItem icon={<Settings size={20}/>} label="Settings" />
            <button className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-2 group">
              <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all group ${active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
    <span className={active ? 'text-emerald-400' : 'group-hover:text-white transition-colors'}>{icon}</span>
    <span className="font-bold text-sm">{label}</span>
  </button>
);

export default Sidebar;