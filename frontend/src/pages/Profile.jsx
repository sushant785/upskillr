import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Edit3, Save, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [bio, setBio] = useState(localStorage.getItem('user_bio') || '');
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [name, setName] = useState('');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const { data } = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${auth?.token}` },
        withCredentials: true
      });
      const localBio = localStorage.getItem('user_bio') || "";
      setUserData({ ...data, bio: localBio });
      setName(data.name);
      setBio(localBio);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type) => {
    setUpdateLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem('auth'));
      const payload = type === 'name' ? { name } : { ...passwords };
      await axios.put('http://localhost:5000/api/profile', payload, {
        headers: { Authorization: `Bearer ${auth?.token}` },
        withCredentials: true,
      });
      if (type === 'name') {
        setUserData({ ...userData, name });
        setIsEditingName(false);
      } else {
        setIsEditingPass(false);
        setPasswords({ oldPassword: '', newPassword: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSaveBio = () => {
    setUpdateLoading(true);
    setTimeout(() => {
      localStorage.setItem('user_bio', bio);
      setUserData(prev => ({ ...prev, bio: bio }));
      setIsEditingBio(false);
      setUpdateLoading(false);
    }, 400);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-main)]">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 max-w-4xl mx-auto p-4 text-[var(--text-main)]"
    >
      <header>
        <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight ">
          User Profile
        </h1>
      </header>

      {/* --- HERO HEADER --- */}
      <div className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-500/20 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 shadow-lg group-hover:rotate-6 transition-transform duration-500">
            <div className="w-full h-full rounded-full bg-[var(--bg-main)] flex items-center justify-center overflow-hidden">
              <User size={60} className="text-[var(--text-muted)]" />
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black uppercase tracking-tight">{userData?.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold border border-emerald-500/20">
                <Shield size={14} /> {userData?.role}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-input)] text-[var(--text-muted)] rounded-full text-xs font-bold border border-[var(--border-subtle)]">
                <Mail size={14} /> {userData?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- IDENTITY SECTION --- */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/10"><User size={20} /></div>
            <h3 className="font-black tracking-tight text-s uppercase">Account Identity</h3>
          </div>

          {!isEditingName ? (
            <div 
              onClick={() => setIsEditingName(true)} 
              className="group/item flex justify-between items-center bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-subtle)] hover:border-emerald-500/40 hover:bg-[var(--bg-input)] transition-all cursor-pointer"
            >
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Display Name</p>
                <p className="text-lg font-bold">{userData?.name}</p>
              </div>
              <div className="p-2 group-hover/item:text-emerald-500 transition-colors">
                <Edit3 size={18} />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input 
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 ring-emerald-500/20 focus:outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => handleUpdate('name')} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex justify-center items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                  {updateLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
                <button onClick={() => setIsEditingName(false)} className="px-6 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl font-bold text-xs uppercase hover:bg-[var(--bg-main)] active:scale-95 transition-all">Cancel</button>
              </div>
            </div>
          )}
        </section>

        {/* --- SECURITY SECTION --- */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-600 border border-cyan-500/10"><Lock size={20} /></div>
            <h3 className="font-black tracking-tight text-l uppercase">Security</h3>
          </div>

          {!isEditingPass ? (
            <div className="flex justify-between items-center bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-subtle)] hover:border-cyan-500/20 transition-all">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Access Credentials</p>
                <p className="text-sm font-bold opacity-60">••••••••••••</p>
              </div>
              <button onClick={() => setIsEditingPass(true)} className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-cyan-500/20">
                Update
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type={showPasswords ? "text" : "password"}
                  placeholder="Current Password"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 focus:outline-none transition-all"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                />
                <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-3.5 text-[var(--text-muted)] hover:text-cyan-500 transition-colors">
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input 
                type={showPasswords ? "text" : "password"}
                placeholder="New Secure Password"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-cyan-500/50 focus:outline-none transition-all"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              />
              <div className="flex gap-2">
                <button onClick={() => handleUpdate('pass')} className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex justify-center items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                  {updateLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update
                </button>
                <button onClick={() => setIsEditingPass(false)} className="px-6 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl font-bold text-xs uppercase hover:bg-[var(--bg-main)] active:scale-95 transition-all">Cancel</button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* --- BIO SECTION --- */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/10"><Edit3 size={20} /></div>
            <h3 className="font-black tracking-tight text-s uppercase">About Me</h3>
          </div>
          {!isEditingBio && (
            <button onClick={() => setIsEditingBio(true)} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 hover:underline transition-all active:scale-95">
              {bio ? "Modify Bio" : "Initialize Bio"}
            </button>
          )}
        </div>

        {!isEditingBio ? (
          <div 
            onClick={() => setIsEditingBio(true)} 
            className="bg-[var(--bg-main)] p-6 rounded-2xl border border-[var(--border-subtle)] min-h-[120px] hover:border-amber-500/20 transition-all cursor-pointer"
          >
            {bio ? (
              <p className="text-[var(--text-main)] leading-relaxed italic opacity-80">"{bio}"</p>
            ) : (
              <p className="text-[var(--text-muted)] italic text-sm">System description empty. Enter profile details...</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea 
              rows="4"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:outline-none text-[var(--text-main)] resize-none transition-all focus:ring-4 ring-emerald-500/5 focus:border-emerald-500/40"
              placeholder="Tell your story..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={handleSaveBio} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                {updateLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Local
              </button>
              <button onClick={() => { setIsEditingBio(false); setBio(localStorage.getItem('user_bio') || ""); }} className="px-8 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[var(--bg-main)] active:scale-95 transition-all">
                Discard
              </button>
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default ProfilePage;