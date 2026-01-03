import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import InstructorSidebar from './sidebar/InstructorSidebar'
import { Menu, Bell, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InstructorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const {auth} = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-['Poppins'] flex overflow-hidden transition-colors duration-300">
      {/* Reusable Sidebar */}
      <InstructorSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* GLOBAL HEADER */}
        {/* CRITICAL FIX: 
            1. Kept 'bg-[var(--bg-main)]/50' (Original transparency)
            2. Kept 'backdrop-blur-md' (Original blur)
            3. Swapped 'border-white/10' -> 'border-[var(--border-subtle)]'
        */}
        <header className="flex items-center justify-between p-4 md:px-8 lg:px-12 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/50 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
          
          <div className="flex items-center gap-4">
            {/* Hamburger */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] text-emerald-500 hover:bg-[var(--bg-card)] transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg hidden sm:block">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <span className="font-black tracking-tighter text-lg md:text-xl uppercase italic text-[var(--text-main)]">
                Upskillr <span className="text-emerald-500 not-italic"></span>
              </span>
            </div>
          </div>
          
          {/* Action Area */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-[var(--border-subtle)]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[var(--text-main)] uppercase tracking-tight">
                  {auth.user.name || "Instructor"}
                </p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Pro Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 border-2 border-[var(--bg-main)] shadow-lg shadow-emerald-500/10" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="max-w-7xl w-full mx-auto p-4 md:p-8 lg:p-12">
          <Outlet context={{ setActiveTab }} />
        </div>
      </main>
    </div>
  );
};

export default InstructorLayout;