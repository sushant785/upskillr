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
    <div className="flex h-[50vh] items-center justify-center bg-[var(--bg-main)] text-emerald-500">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="font-['Poppins'] p-6 md:p-12 min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">My Teaching Hub</h1>
          <p className="text-[var(--text-muted)]">Manage your content and track performance.</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/create-course')}
          className="px-6 py-3 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Course
        </button>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input 
          type="text"
          placeholder="Search your courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl py-3 pl-12 pr-4 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* --- COURSE GRID --- */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-3xl border border-dashed border-[var(--border-subtle)]">
          <p className="text-[var(--text-muted)] font-bold">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: COURSE CARD ---
const CourseCard = ({ course, navigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${
            course.isPublished 
              ? 'bg-emerald-500/90 text-white border border-emerald-500/30' 
              : 'bg-yellow-500/90 text-white border border-yellow-500/30'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 line-clamp-1 text-[var(--text-main)]" title={course.title}>
          {course.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)] mb-6">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-blue-500" />
            <span>{course.studentsCount || 0} Students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500" />
            <span>{course.averageRating || "N/A"}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3">
          {/* THE EDIT BUTTON - Reuses the Builder Route */}
          <button 
            onClick={() => navigate(`/instructor/course/${course._id}/manage`)}
            className="flex-1 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold text-sm hover:brightness-95 dark:hover:brightness-110 flex items-center justify-center gap-2 transition-all"
          >
            <Edit3 size={16} /> Edit
          </button>
          
          <button className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorCourses;