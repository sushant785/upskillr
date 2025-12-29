// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   User, Mail, Shield, MapPin, 
//   ExternalLink, Edit3, Camera, Award 
// } from 'lucide-react';

// const ProfilePage = () => {
//   const user = {
//     name: "Alex Johnson",
//     role: "Senior Fullstack Engineer",
//     location: "San Francisco, CA",
//     email: "alex.j@upskillr.io",
//     bio: "Passionate about building scalable distributed systems and mastering neural network architectures. Currently leveling up in DevOps automation.",
//     achievements: [
//       { id: 1, title: "System Architect", date: "Oct 2024", icon: <Award className="text-yellow-400" /> },
//       { id: 2, title: "Fast Learner", date: "Nov 2024", icon: <Award className="text-emerald-400" /> }
//     ]
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }} 
//       animate={{ opacity: 1, y: 0 }} 
//       className="space-y-8"
//     >
//       {/* Header Section */}
//       <div className="relative bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden">
//         {/* Decorative Background Glow */}
//         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        
//         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
//           <div className="relative group">
//             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1">
//               <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
//                 <User size={60} className="text-slate-700" />
//               </div>
//             </div>
//             <button className="absolute bottom-2 right-2 p-2 bg-emerald-500 rounded-full border-4 border-[#0f172a] hover:scale-110 transition-transform">
//               <Camera size={18} />
//             </button>
//           </div>

//           <div className="text-center md:text-left flex-1">
//             <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
//               <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">{user.name}</h2>
//               <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all w-fit mx-auto md:mx-0">
//                 <Edit3 size={14} /> Edit Profile
//               </button>
//             </div>
//             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-sm font-medium">
//               <span className="flex items-center gap-1.5"><Shield size={16} className="text-emerald-500" /> {user.role}</span>
//               <span className="flex items-center gap-1.5"><MapPin size={16} /> {user.location}</span>
//               <span className="flex items-center gap-1.5"><Mail size={16} /> {user.email}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* About Section */}
//         <div className="lg:col-span-2 space-y-8">
//           <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
//             <h3 className="text-xl font-black uppercase tracking-tight mb-6">Professional Bio</h3>
//             <p className="text-slate-400 leading-relaxed">
//               {user.bio}
//             </p>
//           </section>

//           <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
//             <h3 className="text-xl font-black uppercase tracking-tight mb-6">Learning Achievements</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {user.achievements.map((badge) => (
//                 <div key={badge.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-colors">
//                   <div className="p-3 bg-white/5 rounded-xl">
//                     {badge.icon}
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-sm">{badge.title}</h4>
//                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{badge.date}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* Sidebar Info */}
//         <div className="space-y-8">
//           <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
//             <h3 className="text-lg font-bold mb-6">Quick Links</h3>
//             <div className="space-y-3">
//               <SocialLink label="Portfolio" url="https://alex.dev" />
//               <SocialLink label="GitHub" url="https://github.com/alexj" />
//               <SocialLink label="LinkedIn" url="https://linkedin.com/in/alexj" />
//             </div>
//           </section>

//           <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8">
//             <h3 className="text-lg font-bold text-emerald-400 mb-2">Pro Member</h3>
//             <p className="text-xs text-emerald-500/70 font-bold uppercase mb-6">Subscription active</p>
//             <button className="w-full py-3 bg-emerald-500 text-[#0f172a] font-black text-sm rounded-xl hover:bg-emerald-400 transition-colors">
//               Manage Billing
//             </button>
//           </section>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const SocialLink = ({ label, url }) => (
//   <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
//     <span className="text-sm font-bold text-slate-300 group-hover:text-white">{label}</span>
//     <ExternalLink size={14} className="text-slate-500 group-hover:text-emerald-400" />
//   </a>
// );

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, MapPin, ExternalLink, Edit3, Camera, Award, Save, X, Loader2 } from 'lucide-react';
 
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        
        const auth = JSON.parse(localStorage.getItem('auth'));
        const token = auth?.token;

        const {data}=await axios.get('http://localhost:5000/api/profile',{
          headers:{
            Authorization:`Bearer ${token}`
          },
            withCredentials:true
        });


        setUserData(data);
        setFormData({ name: data.name, password: '' });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      
      const payload = { name: formData.name };
      if (formData.password) payload.password = formData.password;

    

    const auth = JSON.parse(localStorage.getItem('auth'));
    const token = auth?.token;

    await axios.put('http://localhost:5000/api/profile', payload,{
       
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );
      
      // Update local state and exit edit mode
      setUserData({ ...userData, name: formData.name });
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <div className="relative bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1">
              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                <User size={60} className="text-slate-600" />
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-emerald-500 rounded-full border-4 border-[#0f172a] hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <input 
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-xl font-bold focus:outline-none focus:border-emerald-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="New Name"
                  />
                  <input 
                    type="password"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="New Password (leave blank to keep)"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdate}
                      disabled={updateLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-black rounded-lg text-xs font-bold"
                    >
                      {updateLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold"
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">{userData?.name}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all w-fit mx-auto md:mx-0"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Shield size={16} className="text-emerald-500" /> {userData?.role}</span>
              <span className="flex items-center gap-1.5"><Mail size={16} /> {userData?.email}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of UI (Bio, Achievements, Sidebar) remains same using static or dynamic data as needed */}
    </motion.div>
  );
};

export default ProfilePage;