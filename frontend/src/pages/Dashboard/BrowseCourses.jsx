import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import api from '../../utils/api';
import { Search, Filter, Star, Clock, Users, PlayCircle , Info} from 'lucide-react';
import {useToast} from "../../context/ToastContext";
import { motion } from 'framer-motion';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05, delayChildren: 0.1 } 
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  }
};

const BrowseCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const toast = useToast();
  const [error, setError] = useState(null);


  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science'];


  useEffect(() => {
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/learner/browse'); 
      console.log(response.data.courses)
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to load course catalog.");
    } finally {
      setLoading(false);
    }
  };
  fetchCourses();
}, []);

const handleEnroll = async (courseId) => {
  try {
    await api.post('/learner/enroll', { courseId });
    toast.success("Enrolled successfully! Check your My Courses tab.");
  } catch (err) {
    const msg = err.response?.data?.message || "Enrollment failed";
    if (msg.includes("already enrolled")) {
          toast.info("You are already enrolled in this course.");
      } else {
          toast.error(msg);
      }
  }
};
// Filter logic for search and category chips
  const filteredCourses = courses.filter(course => {
  const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === 'All' || course.category?.toLowerCase() === selectedCategory.toLowerCase(); // Case-insensitive
  return matchesSearch && matchesCategory;
});

  return (
    <div className="font-['Poppins'] min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative overflow-hidden">
    
    {/* --- AMBIENT BACKGROUNDS --- */}
    <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
    <div className="fixed bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

    <div className="relative z-10 p-4 md:p-8"> {/* Added relative z-10 wrapper */}
      {/* --- Header & Search --- */}
      <motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
>
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">Explore Courses</h1>
          <p className="text-[var(--text-muted)] text-sm">Discover thousands of courses taught by expert instructors</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-primary)] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] h-12 py-4 pl-12 pr-4 rounded-2xl text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] transition-all shadow-lg"
          />
        </div>
      </motion.div>

      {/* --- Category Chips --- */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedCategory === cat 
              ? 'bg-[var(--brand-primary)] text-[var(--text-on-brand)] border-[var(--brand-primary)]' 
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:text-[var(--text-main)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- Course Grid --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[400px] bg-[var(--bg-card)] rounded-3xl animate-pulse border border-[var(--border-subtle)]"></div>
          ))}
        </div>
      ) : (
        <motion.div 
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
>
          {filteredCourses.map((course) => (
           <motion.div 
    key={course._id} 
    variants={cardVariants}
    whileHover={{ y: -5 }}
    className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
  >
  
                {/* Thumbnail */}
                 <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/learner/course/${course._id}`)}
                   >
                  <img 
                   src={course.thumbnail || "https://via.placeholder.com/640x360?text=Course"} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     alt={course.title} />
                   <div className="absolute top-4 left-4 bg-[var(--bg-card)] backdrop-blur-md text-[var(--text-main)] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-[var(--border-subtle)] shadow-sm">
                         {course.category || 'General'}
              </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                 {/* Title  */}
                 <h3 
                   onClick={() => navigate(`/learner/course/${course._id}`)}
                   className="text-lg font-bold text-[var(--text-main)] mb-2 line-clamp-2 leading-tight cursor-pointer group-hover:text-emerald-400 transition-colors"
                      >
                    {course.title}
                 </h3>
    
                   <p className="text-[var(--text-muted)] text-xs mb-4 flex items-center gap-1">
                   By <span className="text-emerald-400 font-bold">{course.instructor?.name || 'Expert'}</span>
                    </p>

                      <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                     <span className="flex items-center gap-1"><Star size={14} className="text-amber-400" />{course.averageRating}</span>
                     <span className="flex items-center gap-1"><Users size={14} /> {course.studentCount.toLocaleString()} students</span>
                </div>

                   {/* Buttons Container */}
                <div className="mt-auto pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                   <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Price</span>
                   <span className="text-xl font-black text-[var(--text-main)] leading-none">
                   {course.price === 0 ? "FREE" : `₹${course.price}`}
                    </span>
                  </div>
                     {/* Enrollment Button */}
                  <button 
                onClick={(e) => { e.stopPropagation(); handleEnroll(course._id); }}
                   className="bg-emerald-500 text-[var(--text-main)] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                      >
                         Enroll Now
                       </button>
                   </div>

                   {/* Detail Button */}
                       <button 
                      onClick={() => navigate(`/learner/course/${course._id}`)}
                      className="w-full py-2.5 bg-[var(--bg-input)] text-[var(--text-muted)] rounded-xl font-bold text-[10px] uppercase tracking-widest border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all flex items-center justify-center gap-2"
                       >
                        <Info size={14} /> View Course Details
                        </button>
                   </div>
                 </div>
             </motion.div>
                      ))}
                 </motion.div>
                  )}
          </div>
        </div>
  );
}

export default BrowseCourses;