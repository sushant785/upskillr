

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  BarChart, 
  ShieldCheck,
  ArrowRight,
  Zap,
  Target,
  Trophy,
  Layout,
  LogIn,
  BrainCircuit
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-emerald-600 p-1.5 rounded shadow-lg shadow-emerald-900/20">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white uppercase tracking-wider">UpSkillr</span>
          </motion.div>
          
          {/* Sign In Button - Always Visible */}
          <div className="flex items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
            >
              
              Sign In
            </motion.button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center lg:text-left"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Empowering Your Future
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Master New Skills at Your <br className="hidden sm:block" />
            <span className="text-emerald-500">Own Pace & Level Up</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 font-light">
            UpSkillr is your personal growth engine. Access expert-led modules, track achievements, and gain practical knowledge to thrive in a competitive landscape.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all duration-300 shadow-xl"
            >
              Start Learning Now 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
        
        {/* INTERACTIVE MOCKUP */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group lg:block"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-2 sm:p-4 shadow-2xl animate-float">
            <div className="bg-[#020617] rounded-xl border border-slate-700 overflow-hidden">
              <div className="h-9 bg-slate-800 flex items-center gap-1.5 px-4 border-b border-slate-700">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
                </div>
                <span className="text-[10px] text-slate-500 ml-2 font-mono truncate">My Learning Dashboard</span>
              </div>
              <div className="p-4 sm:p-6 space-y-5">
                <div className="flex justify-between items-center">
                   <div className="h-3 w-1/3 bg-slate-800 rounded"></div>
                   <Trophy size={16} className="text-amber-400" />
                </div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[85, 45, 100].map((progress, i) => (
                    <div key={i} className="h-16 sm:h-20 bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col items-center justify-center p-2 sm:p-3">
                       <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden mb-3">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-emerald-500"
                          />
                       </div>
                       <div className="h-1 w-1/2 bg-slate-700 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-24 sm:h-32 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed flex flex-col items-center justify-center gap-3">
                  <Target size={20} className="text-emerald-500/50" />
                  <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-bold text-center px-2">Goal: Complete Web Dev Path</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-slate-800/60">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Students Choose UpSkillr</h2>
          <p className="text-slate-400 font-light max-w-2xl mx-auto text-sm sm:text-base">
            We provide the tools and structure you need to transform your curiosity into professional competence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { 
              icon: <Zap className="text-emerald-500" size={28} />, 
              title: "Accelerated Learning", 
              desc: "Skip the fluff. Our structured modules focus on high-impact skills that employers actually look for." 
            },
            { 
              icon: <Layout className="text-emerald-500" size={28} />, 
              title: "Interactive Experience", 
              desc: "Learn by doing. Engage with practical resources, assessments, and real-world project guides." 
            },
            { 
              icon: <BarChart className="text-emerald-500" size={28} />, 
              title: "Visual Progress", 
              desc: "Stay motivated with real-time tracking. Watch your completion bar grow as you conquer new topics." 
            }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="p-6 sm:p-8 rounded-2xl bg-slate-800/20 border border-slate-800 transition-all duration-300 group hover:bg-slate-800/40 hover:border-emerald-500/30"
            >
              <div className="mb-6 transition-transform group-hover:scale-110 duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#020617] pt-16 pb-8 border-t border-slate-800/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            
            <div className="mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-emerald-600 p-1.5 rounded shadow-lg shadow-emerald-900/20">
                  <BookOpen size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-widest text-white uppercase">UpSkillr</span>
              </div>
              <p className="text-slate-400 text-sm font-light max-w-md leading-relaxed px-4">
                Empowering students with structured pathways and real-time skill tracking. 
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 px-4">
                {['Development', 'Design', 'Business', 'Marketing', 'Data Science'].map((category) => (
                <span key={category} className="px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/50 text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {category}
                </span>
                ))}
            </div>

            <div className="w-full pt-8 border-t border-slate-800/40 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                <p className="text-[10px] text-slate-500 font-mono tracking-tight uppercase">
                    Platform ID: <span className="text-emerald-500/80">EDU-WEB-2025-088</span> 
                </p>
                <p className="text-[9px] text-slate-600 font-mono mt-1">
                    © 2026 UpSkillr Online • Knowledge without boundaries.
                </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Learning Hub Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500/60" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Secure Enrollment</span>
                </div>
                </div>
            </div>
          </div>
        </div>
      </footer>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #020617; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        `}
      </style>
    </div>
  );
};

export default LandingPage;