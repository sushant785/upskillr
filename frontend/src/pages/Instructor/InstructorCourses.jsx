import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js'; // Your new Axios instance
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
        // Assuming backend returns: { success: true, courses: [...] }
        setCourses(data.courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter logic
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center text-emerald-500">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="text-white font-['Poppins'] p-6 md:p-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">My Teaching Hub</h1>
          <p className="text-slate-400">Manage your content and track performance.</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/create-course')} // Navigate to Create Tab
          className="px-6 py-3 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> New Course
        </button>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text"
          placeholder="Search your courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* --- COURSE GRID --- */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-500 font-bold">No courses found.</p>
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
      className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col h-full"
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
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 line-clamp-1" title={course.title}>
          {course.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
          <div className="flex items-center gap-1">
            <Users size={14} className="text-blue-400" />
            <span>{course.studentsCount || 0} Students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400" />
            <span>{course.averageRating || "N/A"}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3">
          {/* THE EDIT BUTTON - Reuses the Builder Route */}
          <button 
            onClick={() => navigate(`/instructor/course/${course._id}/manage`)}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
          >
            <Edit3 size={16} /> Edit
          </button>
          
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorCourses;