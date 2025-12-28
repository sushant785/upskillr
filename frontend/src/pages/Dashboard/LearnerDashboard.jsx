

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Bell, Layers, Target, Clock, 
//   CheckCircle, PlayCircle, BrainCircuit 
// } from 'lucide-react';

// const LearnerDashboard = () => {
//   const [userData] = useState({
//     name: "Alex",
//     stats: { total: 12, inProgress: 4, completed: 8 }
//   });

//   return (
//     <div className="min-h-screen bg-[var(--bg-main)] text-white font-['Poppins'] flex flex-col overflow-x-hidden">
      
      

//       {/* --- MAIN CONTENT (Full Width) --- */}
//       <main className="flex-1 overflow-y-auto">
//         <div className="max-w-7xl mx-auto p-6 md:p-12">
          
//           <header className="mb-10">
//             <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">
//               Dashboard
//             </h1>
//             <p className="text-slate-400 text-sm md:text-lg">
//               Welcome back, <span className="text-emerald-400 font-bold">{userData.name}</span>. Ready to level up?
//             </p>
//           </header>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
            
//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <SummaryCard title="Total Courses" value={userData.stats.total} icon={<Layers className="text-blue-400" />} />
//               <SummaryCard title="In Progress" value={userData.stats.inProgress} icon={<Clock className="text-yellow-400" />} />
//               <SummaryCard title="Completed" value={userData.stats.completed} icon={<CheckCircle className="text-emerald-400" />} />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Ongoing Courses */}
//               <div className="lg:col-span-2 space-y-4">
//                 <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="font-black text-xl tracking-tight uppercase">Ongoing Protocols</h3>
//                     <button className="text-xs font-bold text-emerald-400 hover:underline">View Progress Report</button>
//                   </div>
//                   <div className="space-y-4">
//                     <CourseItem title="Fullstack System Design" progress={65} status="Active" />
//                     <CourseItem title="Advanced DevOps Pipeline" progress={30} status="Active" />
//                     <CourseItem title="Neural Network Basics" progress={10} status="Queued" />
//                   </div>
//                 </section>
//               </div>

//               {/* Mastery Profile */}
//               <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
//                 <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
//                   <Target size={24} className="text-emerald-400" /> Mastery Profile
//                 </h3>
//                 <div className="space-y-6">
//                   <SkillBar label="Engineering" value={85} />
//                   <SkillBar label="Architecture" value={60} />
//                   <SkillBar label="Deployment" value={45} />
//                 </div>
//               </section>
//             </div>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// };

// // --- REUSABLE UI COMPONENTS ---

// const SummaryCard = ({ title, value, icon }) => (
//   <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300">
//     <div>
//       <p className="text-xs uppercase font-black tracking-widest text-slate-500 mb-2">{title}</p>
//       <h4 className="text-3xl md:text-4xl font-black">{value}</h4>
//     </div>
//     <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
//       {React.cloneElement(icon, { size: 28 })}
//     </div>
//   </div>
// );

// const CourseItem = ({ title, progress, status }) => (
//   <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-all cursor-pointer">
//     <div className="flex items-center gap-4">
//       <div className="min-w-[48px] h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
//         <PlayCircle size={24} className="text-emerald-400" />
//       </div>
//       <div>
//         <h5 className="font-bold text-base text-white/90">{title}</h5>
//         <span className="text-[10px] font-black uppercase text-emerald-500/60">{status}</span>
//       </div>
//     </div>
//     <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-2 w-full sm:w-auto">
//       <div className="flex-1 sm:w-32 h-2 bg-white/5 rounded-full overflow-hidden">
//         <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
//       </div>
//       <span className="text-xs font-black min-w-[30px] text-right">{progress}%</span>
//     </div>
//   </div>
// );

// const SkillBar = ({ label, value }) => (
//   <div className="space-y-3">
//     <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
//       <span>{label}</span>
//       <span className="text-white">{value}%</span>
//     </div>
//     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//       <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${value}%` }}></div>
//     </div>
//   </div>
// );

// export default LearnerDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { 
//   Bell, Layers, Target, Clock, 
//   CheckCircle, PlayCircle, Loader2, AlertCircle 
// } from 'lucide-react';
// import api from '../../utils/api';


// const LearnerDashboard = () => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         // This hits your getLearnerDashboard controller endpoint
//         const response = await api.get('/learner/dashboard', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setData(response.data);
//       } catch (err) {
//         console.error("Dashboard error:", err);
//         setError("Failed to initialize system overview.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
//         <Loader2 className="animate-spin text-emerald-400" size={40} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-center">
//         <div className="space-y-4">
//           <AlertCircle className="text-red-400 mx-auto" size={48} />
//           <p className="text-white font-bold uppercase tracking-widest">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[var(--bg-main)] text-white font-['Poppins'] flex flex-col overflow-x-hidden">
      
//       <main className="flex-1 overflow-y-auto">
//         <div className="max-w-7xl mx-auto p-6 md:p-12">
          
//           <header className="mb-10 flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2 italic">
//                 System Overview
//               </h1>
//               <p className="text-slate-400 text-sm md:text-lg">
//                 Operational Status: <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Active Learner</span>
//               </p>
//             </div>
//             <button className="p-3 bg-white/5 border border-white/10 rounded-2xl relative hover:bg-white/10 transition-all">
//               <Bell size={20} />
//               <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
//             </button>
//           </header>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
            
//             {/* Stats Grid - Mapping directly to your controller fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <SummaryCard title="Enrolled Protocols" value={data.enrolledCourses} icon={<Layers className="text-blue-400" />} />
//               <SummaryCard title="Ongoing Tasks" value={data.ongoingCourses} icon={<Clock className="text-yellow-400" />} />
//               <SummaryCard title="Mastery Achieved" value={data.completedCourses} icon={<CheckCircle className="text-emerald-400" />} />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
//               {/* Ongoing Courses (Continue Learning) */}
//               <div className="lg:col-span-2 space-y-4">
//                 <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
//                   <div className="flex items-center justify-between mb-8">
//                     <h3 className="font-black text-xl tracking-tight uppercase italic">Continue Learning</h3>
//                     <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full hover:bg-emerald-500/10 transition-all">
//                       Open Curriculum
//                     </button>
//                   </div>
                  
//                   <div className="space-y-4">
//                     {data.continueLearning.length > 0 ? (
//                       data.continueLearning.map((course) => (
//                         <CourseItem 
//                           key={course.courseId}
//                           title={course.title} 
//                           progress={course.progressPercent} 
//                           thumbnail={course.thumbnail}
//                         />
//                       ))
//                     ) : (
//                       <div className="py-10 text-center opacity-30">
//                         <p className="font-bold uppercase tracking-widest text-sm italic">No active deployments found.</p>
//                       </div>
//                     )}
//                   </div>
//                 </section>
//               </div>

//               {/* Skill Matrix / Mastery Section */}
//               {/* <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10">
//                 <h3 className="font-black text-xl mb-8 flex items-center gap-2 uppercase italic">
//                   <Target size={24} className="text-emerald-400" /> Mastery Profile
//                 </h3>
//                 <div className="space-y-8">
//                   <SkillBar label="Core Knowledge" value={data.completedCourses > 0 ? 100 : 0} />
//                   <SkillBar label="System Engagement" value={data.enrolledCourses > 5 ? 90 : 40} />
//                   <SkillBar label="Persistence" value={75} />
//                 </div>
                
//                 <div className="mt-10 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
//                   <p className="text-[10px] leading-relaxed text-slate-400 font-bold uppercase tracking-tighter">
//                     Next Milestone: Complete <span className="text-emerald-400">"{data.continueLearning[0]?.title || 'your current course'}"</span> to boost Engineering rank.
//                   </p>
//                 </div>
//               </section> */}

//             </div>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---

// const SummaryCard = ({ title, value, icon }) => (
//   <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
//     <div>
//       <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">{title}</p>
//       <h4 className="text-4xl font-black tracking-tighter">{value}</h4>
//     </div>
//     <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform border border-white/5">
//       {React.cloneElement(icon, { size: 28 })}
//     </div>
//   </div>
// );

// const CourseItem = ({ title, progress, thumbnail }) => (
//   <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-all cursor-pointer group">
//     <div className="flex items-center gap-4">
//       <div className="relative w-16 h-12 rounded-lg bg-slate-800 overflow-hidden border border-white/10">
//         {thumbnail ? (
//           <img src={thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-emerald-500/10">
//             <PlayCircle size={20} className="text-emerald-500" />
//           </div>
//         )}
//       </div>
//       <div>
//         <h5 className="font-bold text-base text-white/90 group-hover:text-emerald-400 transition-colors">{title}</h5>
//         <div className="flex items-center gap-2 mt-1">
//            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">In Progress</span>
//         </div>
//       </div>
//     </div>
//     <div className="flex items-center gap-4">
//       <div className="flex flex-col items-end gap-1">
//         <span className="text-[11px] font-black">{progress}%</span>
//         <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
//           <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progress}%` }}></div>
//         </div>
//       </div>
//       <button className="p-2 rounded-xl bg-white/5 group-hover:bg-emerald-500 group-hover:text-black transition-all">
//         <PlayCircle size={20} />
//       </button>
//     </div>
//   </div>
// );

// const SkillBar = ({ label, value }) => (
//   <div className="space-y-3">
//     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
//       <span>{label}</span>
//       <span className="text-white">{value}%</span>
//     </div>
//     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
//       <motion.div 
//         initial={{ width: 0 }}
//         animate={{ width: `${value}%` }}
//         transition={{ duration: 1, ease: "easeOut" }}
//         className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
//       />
//     </div>
//   </div>
// );



// export default LearnerDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Layers, Target, Clock, 
  CheckCircle, PlayCircle, Loader2, AlertCircle, Zap, Flame, Timer, Edit3
} from 'lucide-react';
import api from '../../utils/api';

const LearnerDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streakValue, setStreakValue] = useState(0);

  useEffect(() => {
    // 1. Fetch API Data
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/learner/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to initialize system overview.");
      } finally {
        setIsLoading(false);
      }
    };

    // 2. Real Streak Logic (Local Persistence)
    const handleStreak = () => {
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('last_visit');
      const savedStreak = parseInt(localStorage.getItem('streak_count') || "0");

      if (lastVisit === today) {
        setStreakValue(savedStreak);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit === yesterday.toDateString()) {
          // Continuous daily visit
          const newStreak = savedStreak + 1;
          setStreakValue(newStreak);
          localStorage.setItem('streak_count', newStreak.toString());
        } else {
          // Missed a day or first time
          setStreakValue(1);
          localStorage.setItem('streak_count', "1");
        }
        localStorage.setItem('last_visit', today);
      }
    };

    fetchDashboardData();
    handleStreak();
  }, []);

  const calculateMomentum = () => {
    if (!data?.continueLearning?.length) return 0;
    const total = data.continueLearning.reduce((acc, c) => acc + c.progressPercent, 0);
    return Math.round(total / data.continueLearning.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <AlertCircle className="text-red-400 mx-auto" size={48} />
          <p className="text-white font-bold uppercase tracking-widest">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white font-['Poppins'] flex flex-col overflow-x-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                System Overview
              </h1>
              <p className="text-slate-400 text-sm md:text-lg">
                Operational Status: <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Active Learner</span>
              </p>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Enrolled Protocols" value={data.enrolledCourses} icon={<Layers className="text-blue-400" />} />
              <SummaryCard title="Ongoing Tasks" value={data.ongoingCourses} icon={<Clock className="text-yellow-400" />} />
              <SummaryCard title="Mastery Achieved" value={data.completedCourses} icon={<CheckCircle className="text-emerald-400" />} />
            </div>

            {/* Momentum & Real Streaks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <MomentumCard label="Learning Momentum" value={calculateMomentum()} icon={<Zap size={20}/>} color="emerald" />
               <MomentumCard label="Daily Streak" value={streakValue} unit="Days" icon={<Flame size={20}/>} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Courses */}
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-xl tracking-tight uppercase italic text-white">Continue Learning</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full hover:bg-emerald-500/10 transition-all">
                      Open Curriculum
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {data.continueLearning.length > 0 ? (
                      data.continueLearning.map((course) => (
                        <CourseItem 
                          key={course.courseId}
                          title={course.title} 
                          progress={course.progressPercent} 
                          thumbnail={course.thumbnail}
                        />
                      ))
                    ) : (
                      <div className="py-10 text-center opacity-30">
                        <p className="font-bold uppercase tracking-widest text-sm italic">No active deployments found.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Tools */}
              <aside className="space-y-6">
                <PomodoroTimer />
                <LocalNotes />

                <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                   <p className="text-[10px] leading-relaxed text-slate-400 font-bold uppercase tracking-tight">
                      Next Milestone: Complete <span className="text-emerald-400">"{data.continueLearning[0]?.title || 'Protocol'}"</span>
                   </p>
                </div>
              </aside>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const LocalNotes = () => {
  const [note, setNote] = useState(localStorage.getItem('learner_note') || "");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    localStorage.setItem('learner_note', e.target.value);
  };

  return (
    <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase italic text-white">
          <Edit3 size={18} className="text-emerald-400" /> Study Notes
        </h3>
      </div>
      <textarea
        value={note}
        onChange={handleNoteChange}
        placeholder="Jot down goals..."
        className="w-full h-32 bg-black/20 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 outline-none focus:border-emerald-500/50 transition-all resize-none"
      />
    </section>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
    <div>
      <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">{title}</p>
      <h4 className="text-4xl font-black text-white">{value}</h4>
    </div>
    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform border border-white/5">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

const MomentumCard = ({ label, value, unit = "%", icon, color }) => {
    const colorClasses = {
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        orange: "text-orange-400 border-orange-500/20 bg-orange-500/5"
    };
    return (
        <div className={`p-6 rounded-[2rem] border ${colorClasses[color]} flex items-center justify-between shadow-lg`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black">{value}</span>
                        <span className="text-xs font-bold uppercase opacity-60">{unit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setTimeLeft(1500); setIsActive(false); };
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-lg uppercase italic flex items-center gap-2 text-white text-nowrap">
            <Timer size={20} className="text-blue-400" /> Focus Mode
        </h3>
        <button onClick={resetTimer} className="text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100">Reset</button>
      </div>
      <div className="text-5xl font-black tracking-tighter mb-6 text-center tabular-nums text-white">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <button 
        onClick={toggleTimer}
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
            isActive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500 text-black'
        }`}
      >
        {isActive ? 'Pause' : 'Start Focus'}
      </button>
    </section>
  );
};

const CourseItem = ({ title, progress, thumbnail }) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.08] transition-all cursor-pointer group shadow-sm">
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-12 rounded-lg bg-black/20 overflow-hidden border border-white/10">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-500">
            <PlayCircle size={20} />
          </div>
        )}
      </div>
      <div>
        <h5 className="font-bold text-base text-white/90 group-hover:text-emerald-400 transition-colors">{title}</h5>
        <div className="flex items-center gap-2 mt-1">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">In Progress</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] font-black text-white">{progress}%</span>
        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <button className="p-2 rounded-xl bg-white/10 group-hover:bg-emerald-500 group-hover:text-black transition-all">
        <PlayCircle size={20} />
      </button>
    </div>
  </div>
);

export default LearnerDashboard;