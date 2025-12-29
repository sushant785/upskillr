
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LearnerSidebar from './sidebar/LearnerSidebar';
import { Menu, Bell, BrainCircuit } from 'lucide-react';

const LearnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white font-['Poppins'] flex overflow-hidden">
      {/* Reusable Sidebar */}
      <LearnerSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* GLOBAL HEADER (Visible on Mobile & Desktop) */}
        <header className="flex items-center justify-between p-4 md:px-8 lg:px-12 border-b border-white/10 bg-[var(--bg-main)]/50 backdrop-blur-md sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            {/* Hamburger: Only visible on small/medium screens */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-emerald-500 hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo/Branding: Visible on all screens in the header */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg hidden sm:block">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <span className="font-black tracking-tighter text-lg md:text-xl uppercase italic">
                Upskillr <span className="text-emerald-500 not-italic"></span>
              </span>
            </div>
          </div>
          
          {/* Action Area: Notifications and Profile */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">Alex Johnson</p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Pro Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 border-2 border-slate-800 shadow-lg shadow-emerald-500/10" />
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