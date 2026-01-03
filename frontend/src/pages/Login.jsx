

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, GraduationCap, Presentation, ArrowRight, Sparkles,BrainCircuit } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UpskillrAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('learner');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { setAuth, auth } = useAuth();

  useEffect(() => {
    if (auth?.accessToken && auth?.user) {
      navigate(auth.user.role === 'instructor' ? '/instructor/dashboard' : '/learner/dashboard');
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
        ? { email, password } 
        : { name: `${firstName} ${lastName}`, email, password, role };

    try {
        const response = await axios.post(`http://localhost:5000${endpoint}`, payload, {
          withCredentials: true 
        });

        if (response.status === 200 || response.status === 201) {
          setAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
            role: response.data.user.role
          });
          
          localStorage.setItem('auth', JSON.stringify({
            token: response.data.accessToken,
            user: response.data.user
          }));

          navigate(response.data.user.role === 'learner' ? '/learner/dashboard' : '/instructor/dashboard');
        }
    } catch (err) {
        alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 md:p-6 font-['Poppins'] selection:bg-emerald-500/30 transition-colors duration-300">
      
      <motion.div 
        layout
        className="relative w-full max-w-lg md:max-w-5xl bg-[var(--bg-card)] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[var(--border-subtle)]"
      >
        
        {/* --- Branding Side Panel --- */}
        <motion.div 
          animate={{ 
            x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : (isLogin ? '0%' : '150%'),
          }}
          transition={{ type: "spring", stiffness: 40, damping: 14 }}
          className="w-full md:w-[40%] p-8 md:p-12 text-white flex flex-col justify-between relative z-20 overflow-hidden border-b md:border-b-0 md:border-r border-[var(--border-subtle)]"
        >
          {/* Brand Background Layer */}
          <div className="absolute inset-0 bg-emerald-600 opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-700 to-teal-900 opacity-90" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 md:mb-20">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-lg rotate-3 border border-white/20">
                <BrainCircuit size={20} className="text-white md:w-6 md:h-6" />
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase text-white">Upskillr</h1>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-txt' : 'reg-txt'}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight tracking-tighter text-white">
                  {isLogin ? "Welcome Back." : "Start Your Journey."}
                </h2>
                <p className="text-emerald-50/80 text-sm md:text-lg mb-4 md:mb-10 font-light leading-relaxed">
                  {isLogin 
                    ? "Resume your curriculum and track your daily performance."
                    : "Access industry-standard labs and mentored learning paths."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 hidden md:block text-[10px] font-bold text-emerald-200/40 uppercase tracking-[0.3em]">
            Precision Learning Platform // 2026
          </div>
        </motion.div>

        {/* --- Form Side Panel --- */}
        <motion.div 
          animate={{ 
            x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : (isLogin ? '0%' : '-66.6%') 
          }}
          transition={{ type: "spring", stiffness: 40, damping: 14 }}
          className="w-full md:w-[60%] p-6 md:p-20 bg-transparent relative z-10"
        >
          <div className="max-w-md mx-auto">
            <header className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                {isLogin ? "System Access" : "Initialize Account"}
              </h2>
              <p className="text-[var(--text-muted)] text-xs md:text-sm font-medium">
                {isLogin ? "Enter your credentials to enter the oasis." : "Join the next generation of architects."}
              </p>
            </header>

            {!isLogin && (
              <div className="flex gap-3 md:gap-4 mb-6 md:mb-8">
                <RoleOption selected={role === 'learner'} onClick={() => setRole('learner')} icon={<GraduationCap size={18}/>} title="Learner" />
                <RoleOption selected={role === 'instructor'} onClick={() => setRole('instructor')} icon={<Presentation size={18}/>} title="Expert" />
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" placeholder="Alex" icon={<User size={16}/>} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <InputField label="Last Name" placeholder="Rivera" icon={<User size={16}/>} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              )}
                        
              <InputField label="Secure Email" type="email" placeholder="alex@nexus.com" icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} />  
              <InputField label="Access Key" type="password" placeholder="••••••••" icon={<Lock size={16} />} value={password} onChange={(e) => setPassword(e.target.value)} />
              
              <button className="w-full bg-emerald-500 text-white py-3.5 md:py-4 rounded-xl font-black text-s md:text-sm hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group mt-4">
                {isLogin ? "Authenticate" : "Deploy Account"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-[var(--border-subtle)] text-center">
              <p className="text-[var(--text-muted)] text-xs md:text-sm font-medium">
                {isLogin ? "No access yet?" : "Joined before?"}{' '}
                <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-500 font-black hover:text-emerald-600 ml-1 md:ml-2 transition-colors uppercase">
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const RoleOption = ({ selected, onClick, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 p-3 md:p-4 rounded-xl border transition-all flex flex-col items-center gap-2 active:scale-95 ${
      selected 
        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
        : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-input)]'
    }`}
  >
    {icon}
    <span className="font-black text-[9px] md:text-[10px] uppercase tracking-tighter">{title}</span>
  </button>
);

const InputField = ({ label, icon, placeholder, type = "text", value, onChange }) => (
  <div className="space-y-1.5 md:space-y-2 text-left">
    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-[var(--text-muted)] ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-emerald-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-4 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-xs md:text-sm text-[var(--text-main)] focus:border-emerald-500/50 focus:outline-none transition-all placeholder:text-[var(--text-muted)]/50"
      />
    </div>
  </div>
);

export default UpskillrAuth;