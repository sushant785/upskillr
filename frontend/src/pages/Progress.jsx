

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Clock, CheckCircle2, 
  BarChart3, Layout, ArrowUpRight, 
  Loader2, AlertCircle, User
} from 'lucide-react';
import api from '../utils/api';

const Progress = () => {
  const [data, setData] = useState({ courses: [], count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/learner/my-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        setError("Failed to synchronize progress data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-[var(--brand-primary)]" size={40} />
    </div>
  );

  const completedCount = data.courses.filter(c => c.status === 'completed').length;
  const inProgressCount = data.courses.filter(c => c.status === 'in-progress').length;
  const efficiencyValue = data.count > 0 
  ? Math.round((completedCount / data.count) * 100) 
  : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 px-4 md:px-0 pb-10 text-[var(--text-main)]">
      {/* Header & Overall Stats */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-[var(--text-muted)] text-xs md:text-sm font-medium">
            Tracking your trajectory through the Upskillr protocols.
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3 md:gap-4">
          <div className="flex-1 md:flex-none bg-[var(--bg-card)] border border-[var(--border-subtle)] px-6 py-4 rounded-2xl shadow-sm">
            <p className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">Efficiency</p>
            <p className={`text-xl font-black ${efficiencyValue > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
          {efficiencyValue}%
        </p>
          </div>
          {/* <div className="flex-1 md:flex-none bg-[var(--brand-primary)] px-6 py-4 rounded-2xl text-[var(--text-on-brand)] shadow-lg shadow-emerald-500/20">
            <p className="text-[9px] font-black uppercase opacity-70 tracking-widest">Total Rank</p>
            <p className="text-xl font-black">#422</p>
          </div> */}
        </div>
      </header>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <ProgressStatCard icon={<Layout className="text-blue-500" size={20} />} label="Active Enrollments" value={data.count} />
        <ProgressStatCard icon={<Clock className="text-amber-500" size={20} />} label="In Progress" value={inProgressCount} />
        <ProgressStatCard icon={<Trophy className="text-emerald-500" size={20} />} label="Protocols Mastered" value={completedCount} />
      </div>

      {/* Main Content Area */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)]">
          <h3 className="font-black text-sm md:text-lg uppercase flex items-center gap-2">
            <BarChart3 size={18} className="text-[var(--brand-primary)]" /> Detailed Log
          </h3>
          <span className="hidden sm:inline text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
            System Synchronized
          </span>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-[var(--border-subtle)]">
          {data.courses.length > 0 ? (
            data.courses.map((item) => (
              <MobileCourseCard key={item._id} item={item} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-input)]">
                <th className="px-8 py-5">Protocol Name</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Completion Bar</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {data.courses.map((item) => (
                <tr key={item._id} className="group hover:bg-[var(--bg-input)] transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {item.course?.title || "Unknown Course"}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold flex items-center gap-1 mt-1">
                      <User size={10} /> {item.course?.instructor?.name}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-8 py-6 w-64">
                    <ProgressBar percent={item.progressPercent} status={item.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:bg-[var(--brand-primary)] hover:text-[var(--text-on-brand)] transition-all shadow-sm">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.courses.length === 0 && <EmptyState />}
        </div>
      </section>
    </div>
  );
};

const MobileCourseCard = ({ item }) => (
  <div className="p-6 space-y-4 bg-[var(--bg-card)]">
    <div className="flex justify-between items-start gap-4">
      <div>
        <h4 className="font-bold text-[var(--text-main)] leading-tight">{item.course?.title}</h4>
        <p className="text-[10px] text-[var(--text-muted)] uppercase mt-1 flex items-center gap-1 font-bold">
          <User size={10} /> {item.course?.instructor?.name}
        </p>
      </div>
      <StatusBadge status={item.status} />
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-[var(--text-muted)]">Progress</span>
        <span className="text-[var(--text-main)]">{item.progressPercent}%</span>
      </div>
      <ProgressBar percent={item.progressPercent} status={item.status} />
    </div>

    <button className="w-full py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-[var(--brand-primary)] hover:text-[var(--text-on-brand)] transition-all">
      Resume Protocol <ArrowUpRight size={14} />
    </button>
  </div>
);

const ProgressBar = ({ percent, status }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        className={`h-full ${status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'}`}
      />
    </div>
    <span className="hidden md:block text-[11px] font-black text-[var(--text-main)] w-8">{percent}%</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${
    status === 'completed' 
    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
    : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
  }`}>
    {status}
  </span>
);

const EmptyState = () => (
  <div className="p-20 text-center flex flex-col items-center gap-4">
    <AlertCircle className="text-[var(--text-muted)] opacity-20" size={48} />
    <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-sm">
      No Active Protocols Detected
    </p>
  </div>
);

const ProgressStatCard = ({ icon, label, value }) => (
 <div className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 md:p-8 rounded-2xl md:rounded-[2rem] flex items-center gap-6 hover:border-[var(--brand-primary)] transition-all duration-300 shadow-sm hover:shadow-xl">
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[var(--bg-input)] flex items-center justify-center border border-[var(--border-subtle)] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>

    <div>
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">{label}</p>
      <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-[var(--text-main)] uppercase">{value}</h4>
    </div>
  </div>
);

export default Progress;