import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, Clock, CheckCircle, 
  PlayCircle, Loader2, AlertCircle, 
  Zap, Flame, Timer, Edit3
} from 'lucide-react';
import api from '../../utils/api';

const LearnerDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streakValue, setStreakValue] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/learner/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
        console.log(response.data)
      } catch (err) {
        setError("Failed to initialize system overview.");
      } finally {
        setIsLoading(false);
      }
    };

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
          const newStreak = savedStreak + 1;
          setStreakValue(newStreak);
          localStorage.setItem('streak_count', newStreak.toString());
        } else {
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

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--brand-primary)]" size={40} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-center text-[var(--text-main)]">
      <div className="space-y-4">
        <AlertCircle className="text-red-500 mx-auto" size={48} />
        <p className="font-black uppercase tracking-widest">{error}</p>
      </div>
    </div>
  );

  const completedCount = data?.continueLearning?.filter(c => c.progressPercent === 100).length || 0;
  const ongoingCount = data?.continueLearning?.filter(c => c.progressPercent < 100).length || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col overflow-x-hidden">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <header className="mb-10">
            <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">
              System Overview
            </h1>
            <p className="text-[var(--text-muted)] text-sm md:text-base font-medium">
              Operational Status: <span className="text-emerald-500 font-black uppercase tracking-widest text-xs">Active Learner</span>
            </p>
          </header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Enrolled Protocols" value={data.enrolledCourses} icon={<Layers className="text-blue-500" />} />
              <SummaryCard title="Ongoing Tasks" value={ongoingCount} icon={<Clock className="text-amber-500" />} />
              <SummaryCard title="Mastery Achieved" value={completedCount} icon={<CheckCircle className="text-emerald-500" />} />
            </div>

            {/* Momentum & Streaks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <MomentumCard label="Learning Momentum" value={calculateMomentum()} icon={<Zap size={20}/>} color="emerald" />
               <MomentumCard label="Daily Streak" value={streakValue} unit="Days" icon={<Flame size={20}/>} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Courses */}
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-xl tracking-tight uppercase">Continue Learning</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/20 px-4 py-2 rounded-full hover:bg-emerald-500/10 transition-all">
                      Open Curriculum
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {data.continueLearning.length > 0 ? (
                      data.continueLearning.map((course) => (
                        <CourseItem 
                          key={course.courseId}
                          courseId={course.courseId}
                          title={course.title} 
                          progress={course.progressPercent} 
                          thumbnail={course.thumbnail}
                          lastLessonId={course.lastAccessedLesson}
                        />
                      ))
                    ) : (
                      <div className="py-10 text-center opacity-30">
                        <p className="font-black uppercase tracking-widest text-sm">No active deployments found.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Tools */}
              <aside className="space-y-6">
                <PomodoroTimer />
                <LocalNotes />
                <div className="p-6 rounded-2xl md:rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 shadow-sm">
                   <p className="text-[10px] leading-relaxed text-[var(--text-muted)] font-bold uppercase tracking-tight">
                     Next Milestone: Complete <span className="text-emerald-600">"{data.continueLearning[0]?.title || 'Protocol'}"</span>
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
    <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl md:rounded-[2.5rem] p-8 shadow-sm">
      <h3 className="font-black text-lg flex items-center gap-2 uppercase mb-4">
        <Edit3 size={18} className="text-emerald-500" /> Study Notes
      </h3>
      <textarea
        value={note}
        onChange={handleNoteChange}
        placeholder="Jot down goals..."
        className="w-full h-32 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-4 text-sm text-[var(--text-main)] outline-none focus:border-emerald-500/50 transition-all resize-none"
      />
    </section>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-2xl md:rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300 shadow-sm">
    <div>
      <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-2">{title}</p>
      <h4 className="text-4xl font-black">{value}</h4>
    </div>
    <div className="p-4 bg-[var(--bg-input)] rounded-2xl group-hover:scale-110 transition-transform border border-[var(--border-subtle)]">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

const MomentumCard = ({ label, value, unit = "%", icon, color }) => {
    const colorClasses = {
        emerald: "text-emerald-600 border-emerald-500/20 bg-emerald-500/5",
        orange: "text-orange-600 border-orange-500/20 bg-orange-500/5"
    };
    return (
        <div className={`p-6 rounded-2xl md:rounded-[2rem] border ${colorClasses[color]} flex items-center justify-between shadow-sm`}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)]">{icon}</div>
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
    <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl md:rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-lg uppercase flex items-center gap-2">
            <Timer size={20} className="text-blue-500" /> Focus Mode
        </h3>
        <button onClick={resetTimer} className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-red-500 transition-colors">Reset</button>
      </div>
      <div className="text-5xl font-black tracking-tighter mb-6 text-center tabular-nums">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <button 
        onClick={toggleTimer}
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
            isActive ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-emerald-500 text-[var(--text-on-brand)]'
        }`}
      >
        {isActive ? 'Pause' : 'Start Focus'}
      </button>
    </section>
  );
};

const CourseItem = ({ title, progress, thumbnail,courseId,lastLessonId }) => {
  const navigate = useNavigate();
  const handleContinue = () => {
    if(lastLessonId) {
      navigate(`/learner/course/${courseId}/learn?lessonId=${lastLessonId}`);
    }
    else {
      navigate(`/learner/course/${courseId}/learn`);
    }
  }
  
  return (
    <div onClick={handleContinue} className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/30 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-12 rounded-lg bg-[var(--bg-main)] overflow-hidden border border-[var(--border-subtle)]">
          {thumbnail ? (
            <img src={thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-600">
              <PlayCircle size={20} />
            </div>
          )}
        </div>
        <div>
          <h5 className="font-bold text-base text-[var(--text-main)] group-hover:text-emerald-600 transition-colors">{title}</h5>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">In Progress</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] font-black">{progress}%</span>
          <div className="w-32 h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
            <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] group-hover:bg-emerald-500 group-hover:text-[var(--text-on-brand)] transition-all shadow-sm">
          <PlayCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default LearnerDashboard;