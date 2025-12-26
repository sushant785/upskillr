

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Layers, Target, Clock, 
  CheckCircle, PlayCircle, BrainCircuit 
} from 'lucide-react';

const LearnerDashboard = () => {
  const [userData] = useState({
    name: "Alex",
    stats: { total: 12, inProgress: 4, completed: 8 }
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white font-['Poppins'] flex flex-col overflow-x-hidden">
      
      

      {/* --- MAIN CONTENT (Full Width) --- */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm md:text-lg">
              Welcome back, <span className="text-emerald-400 font-bold">{userData.name}</span>. Ready to level up?
            </p>
          </header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Total Courses" value={userData.stats.total} icon={<Layers className="text-blue-400" />} />
              <SummaryCard title="In Progress" value={userData.stats.inProgress} icon={<Clock className="text-yellow-400" />} />
              <SummaryCard title="Completed" value={userData.stats.completed} icon={<CheckCircle className="text-emerald-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ongoing Courses */}
              <div className="lg:col-span-2 space-y-4">
                <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-xl tracking-tight uppercase">Ongoing Protocols</h3>
                    <button className="text-xs font-bold text-emerald-400 hover:underline">View Progress Report</button>
                  </div>
                  <div className="space-y-4">
                    <CourseItem title="Fullstack System Design" progress={65} status="Active" />
                    <CourseItem title="Advanced DevOps Pipeline" progress={30} status="Active" />
                    <CourseItem title="Neural Network Basics" progress={10} status="Queued" />
                  </div>
                </section>
              </div>

              {/* Mastery Profile */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
                <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
                  <Target size={24} className="text-emerald-400" /> Mastery Profile
                </h3>
                <div className="space-y-6">
                  <SkillBar label="Engineering" value={85} />
                  <SkillBar label="Architecture" value={60} />
                  <SkillBar label="Deployment" value={45} />
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// --- REUSABLE UI COMPONENTS ---

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300">
    <div>
      <p className="text-xs uppercase font-black tracking-widest text-slate-500 mb-2">{title}</p>
      <h4 className="text-3xl md:text-4xl font-black">{value}</h4>
    </div>
    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

const CourseItem = ({ title, progress, status }) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="min-w-[48px] h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
        <PlayCircle size={24} className="text-emerald-400" />
      </div>
      <div>
        <h5 className="font-bold text-base text-white/90">{title}</h5>
        <span className="text-[10px] font-black uppercase text-emerald-500/60">{status}</span>
      </div>
    </div>
    <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-2 w-full sm:w-auto">
      <div className="flex-1 sm:w-32 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs font-black min-w-[30px] text-right">{progress}%</span>
    </div>
  </div>
);

const SkillBar = ({ label, value }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default LearnerDashboard;