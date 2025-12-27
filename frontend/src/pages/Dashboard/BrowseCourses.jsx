import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Search, Filter, Star, Clock, Users, PlayCircle } from 'lucide-react';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science'];


  useEffect(() => {
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/learner/browse'); 
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchCourses();
}, []);


const handleEnroll = async (courseId) => {
  try {
    await api.post('/learner/enroll', { courseId });
    alert("Enrolled successfully! Check your My Courses tab.");
  } catch (err) {
    alert(err.response?.data?.message || "Enrollment failed");
  }
};

  // const handleEnroll = async (courseId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     await axios.post('http://localhost:5000/api/learner/enroll', 
  //       { courseId }, 
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     alert("Enrolled successfully! Check your My Courses tab.");
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Enrollment failed");
  //   }
  // };

  // Filter logic for search and category chips
  const filteredCourses = courses.filter(course => {
  const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === 'All' || course.category?.toLowerCase() === selectedCategory.toLowerCase(); // Case-insensitive
  return matchesSearch && matchesCategory;
});

  return (
    <div className="p-4 md:p-8">
      {/* --- Header & Search --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Explore Courses</h1>
          <p className="text-[var(--text-muted)] text-sm">Discover thousands of courses taught by expert instructors</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-primary)] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] h-12 py-4 pl-12 pr-4 rounded-2xl text-white focus:outline-none focus:border-[var(--brand-primary)] transition-all shadow-lg"
          />
        </div>
      </div>

      {/* --- Category Chips --- */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedCategory === cat 
              ? 'bg-[var(--brand-primary)] text-[var(--text-on-brand)] border-[var(--brand-primary)]' 
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:text-white'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course) => (
            <div key={course._id} className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden hover:border-[var(--brand-primary)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.thumbnail || "https://via.placeholder.com/640x360?text=Course"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={course.title} 
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                  {course.category || 'General'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-[var(--brand-primary)] transition-colors">
                  {course.title}
                </h3>
                <p className="text-[var(--text-muted)] text-xs mb-4 flex items-center gap-1">
                  By <span className="text-emerald-400 font-bold">{course.instructor?.name || 'Expert'}</span>
                </p>

                <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><Star size={14} className="text-amber-400" /> 4.8</span>
                  <span className="flex items-center gap-1"><Users size={14} /> 1.2k Students</span>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-6 mt-auto gap-2">
    <div className="flex flex-col">
       <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Price</span>
       <span className="text-xl font-black text-white leading-none">
         {course.price === 0 ? "FREE" : `₹${course.price}`}
       </span>
    </div>
       <button onClick={() => handleEnroll(course._id)}
          className="bg-[var(--brand-primary)] text-[var(--text-on-brand)] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[var(--brand-primary-hover)] transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
            Enroll Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;