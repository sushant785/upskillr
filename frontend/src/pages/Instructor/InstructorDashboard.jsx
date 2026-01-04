import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import useNavigate
import { useNavigate } from 'react-router-dom'; 
import { 
  Users, Activity, Bell, Plus, 
  CheckCircle2, Zap, ArrowUpRight, FileEdit,
  LayoutGrid, Sparkles, TrendingUp, Cpu, BookOpen
} from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 120, damping: 12 } 
  }
};

const statCardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 120, damping: 12 } 
  },
  hover: { 
    y: -5, 
    scale: 1.02,
    boxShadow: "0px 10px 30px -5px rgba(16, 185, 129, 0.2)",
    transition: { duration: 0.3 }
  }
};

const InstructorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeGreeting, setTimeGreeting] = useState("");
  const navigate = useNavigate(); 
  const toast = useToast();

  // --- LOGIC: Greeting based on time ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeGreeting("Good Morning, Instructor.");
    else if (hour < 18) setTimeGreeting("Good Afternoon, Instructor.");
    else setTimeGreeting("Good Evening, Instructor.");
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/instructor/dashboard')
        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard Sync Failed:", err);
        const errorMsg = err.response?.data?.message || "Failed to load dashboard data";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent animate-pulse" />
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
            <Cpu size={64} className="text-emerald-500" />
        </motion.div>
        <p className="text-emerald-500/60 text-xs font-mono mt-6 tracking-[0.3em] animate-pulse">LOADING DASHBOARD...</p>
    </div>
  );

  // --- ERROR STATE ---
  if (error) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-8 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <div className="text-center relative z-10 bg-[var(--bg-card)] p-10 rounded-3xl border border-red-500/20 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tighter">Connection Error</h2>
            <p className="text-[var(--text-muted)] text-sm mb-8 font-mono">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
                Retry Connection
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-['Poppins'] flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-300">
      
      {/* --- AMBIENT BACKGROUNDS --- */}
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-emerald-500/20">
        <div className="max-w-7xl mx-auto p-6 md:p-12 pb-24">
          
          {/* --- HEADER --- */}
          <motion.header 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-16 flex flex-col md:flex-row justify-between md:items-end gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Instructor Hub
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-main)] leading-[1.1]">
                {timeGreeting}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // 3. Navigation: Create Course
                onClick={() => navigate('/instructor/create-course')}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                <span>Create Course</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl relative hover:brightness-110 transition-all group"
              >
                <Bell size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
            </div>
          </motion.header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            
            {/* --- HERO STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                label="Total Students" 
                value={dashboardData.totalEnrollments || 0} 
                icon={<Users />} 
                color="blue" 
                trend="+12%"
              />
              <StatCard 
                label="Active Learners" 
                value={dashboardData.activeLearners || 0} 
                icon={<Activity />} 
                color="emerald" 
                trend="Stable"
              />
              <StatCard 
                label="Published Courses" 
                value={dashboardData.publishedCourses || 0} 
                icon={<CheckCircle2 />} 
                color="orange" 
                trend="High"
              />
              <StatCard 
                label="Draft Courses" 
                value={dashboardData.draftCourses || 0} 
                icon={<FileEdit />} 
                color="purple" 
                trend="In Progress"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* --- MAIN COLUMN: COURSE MANAGEMENT --- */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                
                {/* Section Title */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <LayoutGrid className="text-emerald-500" /> Recent Courses
                    </h3>
                    <button 
                      // 4. Navigation: View All Courses
                      onClick={() => navigate('/instructor/courses')}
                      className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase tracking-widest transition-colors"
                    >
                        View All Courses &rarr;
                    </button>
                </div>

                {/* Course List Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-[2.5rem] p-8 overflow-hidden">
                        
                        <div className="space-y-4">
                            {dashboardData.recentCourses && dashboardData.recentCourses.length > 0 ? (
                                dashboardData.recentCourses.map((course) => (
                                    <CourseRow key={course._id} course={course} />
                                ))
                            ) : (
                                <div className="text-center py-16 border-2 border-dashed border-[var(--border-subtle)] rounded-3xl">
                                    <div className="inline-block p-4 rounded-full bg-[var(--bg-input)] mb-4">
                                        <LayoutGrid className="text-[var(--text-muted)]" size={32} />
                                    </div>
                                    <p className="text-[var(--text-muted)] font-bold">No Courses Found</p>
                                    <button 
                                      onClick={() => navigate('/instructor/create-course')}
                                      className="text-xs text-emerald-500 hover:text-emerald-400 mt-2 font-mono uppercase tracking-widest"
                                    >
                                      CREATE YOUR FIRST COURSE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoBlock 
                        title="Course Content"
                        value={dashboardData.totalCourses || 0}
                        subtext="Total Courses Created"
                        icon={<BookOpen size={24} />}
                        gradient="from-blue-500/20 to-purple-500/20"
                    />
                    <InfoBlock 
                        title="Publishing Rate"
                        value={`${dashboardData.totalCourses > 0 ? Math.round((dashboardData.publishedCourses / dashboardData.totalCourses) * 100) : 0}%`}
                        subtext="Completion Ratio"
                        icon={<Zap size={24} />}
                        gradient="from-emerald-500/20 to-teal-500/20"
                    />
                </div>
              </motion.div>

              {/* --- SIDE COLUMN: INTELLIGENCE --- */}
              <motion.aside variants={itemVariants} className="space-y-6">
                
                {/* Live Feed Panel */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                   {/* Decorative gradient blob */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                   <h3 className="font-bold text-lg text-[var(--text-main)] mb-6 flex items-center gap-3">
                      <Activity className="text-emerald-500 animate-pulse" size={18} /> 
                      <span className="uppercase tracking-widest text-xs">Recent Enrollments</span>
                   </h3>

                   <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {dashboardData.recentEnrollments && dashboardData.recentEnrollments.length > 0 ? (
                          dashboardData.recentEnrollments.map((item, index) => (
                              <FeedItem key={index} item={item} />
                          ))
                      ) : (
                          <div className="text-center py-8 opacity-40">
                              <p className="text-xs font-mono text-[var(--text-muted)]">NO RECENT ACTIVITY</p>
                          </div>
                      )}
                   </div>

                   <button 
                      onClick={() => navigate('/instructor/enrollments')}
                      className="w-full mt-8 py-4 bg-[var(--bg-input)] hover:brightness-110 border border-[var(--border-subtle)] rounded-xl text-[10px] text-[var(--text-main)] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
                   >
                      View All Activity <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                </div>

                {/* Insight Card */}
                <div className="p-1 rounded-[2rem] bg-gradient-to-br from-emerald-500/30 to-blue-600/30">
                    <div className="bg-[var(--bg-base-solid)] rounded-[1.8rem] p-6 h-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)] text-emerald-500 shrink-0">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-[var(--text-main)] text-lg italic tracking-tight">Quick Insight</h4>
                                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed font-medium">
                                    You have <span className="text-emerald-500 font-bold">{dashboardData.draftCourses || 0} courses</span> currently in draft. Publishing them could increase your student reach by <span className="text-[var(--text-main)] border-b border-emerald-500">40%</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

              </motion.aside>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon, color, trend }) => {
    // Note: Backgrounds set to use variables or specific colors that work on both
    const colors = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    };

    return (
        <motion.div 
            variants={statCardVariants}
            whileHover="hover"
            // Use bg-card from variables to maintain black theme default
            className={`p-6 rounded-[2rem] border ${colors[color]} bg-[var(--bg-card)] backdrop-blur-md relative overflow-hidden group cursor-default`}
        >
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${colors[color].split(" ")[1]} backdrop-blur-sm`}>
                        {React.cloneElement(icon, { size: 24 })}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--bg-input)] px-2 py-1 rounded text-[var(--text-muted)]">
                        {trend}
                    </span>
                </div>
                <div>
                    <h4 className="text-4xl font-black text-[var(--text-main)] tracking-tight">{value}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1 text-[var(--text-muted)]">{label}</p>
                </div>
            </div>
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${colors[color].split(" ")[0].replace("text", "bg")}`} />
        </motion.div>
    );
};

const CourseRow = ({ course }) => {
    // 5. Use Navigation in Subcomponent
    const navigate = useNavigate();

    // 6. Define Navigation Handler for Course Management
    const handleManage = () => {
        navigate(`/instructor/course/${course._id}/manage`);
    };

    return (
      <motion.div 
          whileHover={{ x: 5 }}
          onClick={handleManage} // Navigate when clicking the row
          className="group flex items-center justify-between p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-input)] hover:brightness-105 transition-all cursor-pointer"
      >
          <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center font-black text-[var(--text-muted)] text-xl group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all">
                  {course.title ? course.title.charAt(0) : "X"}
              </div>
              <div>
                  <h5 className="font-bold text-[var(--text-main)] text-base group-hover:text-emerald-500 transition-colors">{course.title}</h5>
                  <div className="flex items-center gap-3 mt-1.5">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${course.isPublished ? 'text-emerald-500' : 'text-yellow-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${course.isPublished ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
                          {course.isPublished ? "Published" : "Draft"}
                      </span>
                  </div>
              </div>
          </div>
          
          <div className="flex items-center gap-6 pr-4">
              <div className="text-right hidden sm:block">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-widest group-hover:text-[var(--text-main)] transition-colors">Manage</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <FileEdit size={16} />
              </div>
          </div>
      </motion.div>
    );
};

const FeedItem = ({ item }) => (
    <div className="flex gap-4 relative pl-4 border-l border-[var(--border-subtle)] hover:border-emerald-500/50 transition-colors group">
        <div className="absolute left-[-2.5px] top-2 w-[5px] h-[5px] rounded-full bg-[var(--text-muted)] group-hover:bg-emerald-500 transition-colors" />
        <div className="flex-1">
            <p className="text-sm text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text-main)] group-hover:text-emerald-500 transition-colors">{item.learner}</span> enrolled in <span className="font-medium text-[var(--text-main)] border-b border-[var(--border-subtle)]">{item.course}</span>.
            </p>
            <p className="text-[10px] font-mono text-[var(--text-muted)] mt-2 uppercase">
                {new Date(item.enrolledAt).toLocaleTimeString()}
            </p>
        </div>
    </div>
);

const InfoBlock = ({ title, value, subtext, icon, gradient }) => (
    <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${gradient} border border-[var(--border-subtle)] relative overflow-hidden`}>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-[var(--text-main)] opacity-80">
                {icon} <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
            </div>
            <div className="text-4xl font-black text-[var(--text-main)] tracking-tighter mb-1">{value}</div>
            <div className="text-[10px] text-[var(--text-main)] opacity-50 font-mono uppercase">{subtext}</div>
        </div>
    </div>
);

export default InstructorDashboard;