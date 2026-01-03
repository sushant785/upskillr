
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LearnerSidebar from './sidebar/LearnerSidebar';
import { Menu, Bell, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LearnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [userData, setUserData] = useState(null);
  const {auth} = useAuth();
  console.log(auth)


  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-['Poppins'] flex overflow-hidden">
      {/* Reusable Sidebar */}
      <LearnerSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* GLOBAL HEADER */}
        <header className="flex items-center justify-between p-4 md:px-8 lg:px-12 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          
          <div className="flex items-center gap-4">
            {/* Hamburger: Small/Medium screens */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] text-emerald-600 hover:bg-[var(--brand-primary)] hover:text-white transition-all"
            >
              <Menu size={24} />
            </button>

            {/* Logo/Branding */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg hidden sm:block shadow-md shadow-emerald-500/20">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <span className="font-black tracking-tighter text-lg md:text-xl uppercase">
                Upskillr <span className="text-emerald-600">.</span>
              </span>
            </div>
          </div>
          
          {/* Action Area: Notifications and Profile */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-emerald-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-[var(--border-subtle)]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[var(--text-main)] uppercase tracking-tight">
                  {auth.user.name || "Learner"}
                </p>
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                  Level 12
                </p>
              </div>
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 border-2 border-[var(--bg-card)] shadow-md shadow-emerald-500/10" />
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

export default LearnerLayout;