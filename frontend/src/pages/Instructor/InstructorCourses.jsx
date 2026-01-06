import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import { motion } from 'framer-motion';
import { 
  Search, Edit3, Trash2, MoreVertical, 
  Users, Star, Plus, Loader2
} from 'lucide-react';

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Instructor's Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/instructor/my-courses');
        setCourses(data.courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg-main)] text-emerald-500 relative overflow-hidden">
       {/* Loading Background Effect */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent animate-pulse" />
      <Loader2 className="animate-spin relative z-10" size={40} />
    </div>
  );

  return (
    <div className="font-['Poppins'] min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative overflow-hidden">
      
      {/* --- AMBIENT BACKGROUNDS (Added) --- */}
      {/* Top Right (Near Create Button) */}
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      {/* Bottom Left (Balance) */}
      <div className="fixed bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* --- MAIN CONTENT (Wrapped in z-10 to sit above bg) --- */}
      <div className="relative z-10 p-6 md:p-12">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Course Manager</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">My Teaching Hub</h1>
            <p className="text-[var(--text-muted)] mt-2">Manage your content and track performance.</p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/instructor/create-course')}
            className="px-6 py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
            <span>Create New Course</span>
          </motion.button>
        </motion.div>

        {/* --- SEARCH & FILTERS --- */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 relative max-w-md"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
          <input 
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-sm"
          />
        </motion.div>

        {/* --- COURSE GRID --- */}
        {filteredCourses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl border border-dashed border-[var(--border-subtle)]"
          >
            <p className="text-[var(--text-muted)] font-bold mb-4">No courses found matching criteria.</p>
            <button 
                onClick={() => setSearchTerm('')}
                className="text-xs text-emerald-500 hover:underline uppercase tracking-widest"
            >
                Clear Search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course._id} course={course} navigate={navigate} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: COURSE CARD ---
const CourseCard = ({ course, navigate, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all flex flex-col h-full relative"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
            course.isPublished 
              ? 'bg-emerald-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-10">
        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-[var(--text-main)] group-hover:text-emerald-500 transition-colors" title={course.title}>
          {course.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)] mb-6">
          <div className="flex items-center gap-1.5 bg-[var(--bg-input)] px-2 py-1 rounded-md">
            <Users size={12} className="text-blue-500" />
            <span>{course.studentCount || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[var(--bg-input)] px-2 py-1 rounded-md">
            <Star size={12} className="text-yellow-500" />
            <span>{course.averageRating || "N/A"}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3">
          {/* THE EDIT BUTTON */}
          <button 
            onClick={() => navigate(`/instructor/course/${course._id}/manage`)}
            className="flex-1 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] font-black text-[10px] uppercase tracking-wider hover:bg-emerald-500 hover:text-white hover:border-emerald-500 flex items-center justify-center gap-2 transition-all"
          >
            <Edit3 size={14} /> Manage
          </button>
          
          {/* <button className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all">
            <Trash2 size={16} />
          </button> */}
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorCourses;