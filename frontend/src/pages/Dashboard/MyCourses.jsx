import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

 useEffect(() => {
  const fetchMyCourses = async () => {
    setLoading(true); 
    try {
      const response = await api.get('/learner/my-courses'); 
      setEnrollments(response.data.courses || []);
      console.log(response)
    } catch (err) {
      console.error("Error fetching my courses:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMyCourses();
 }, []);



  const handleContinueBtn = (courseId, lessonId) => {
      if (lessonId) {
        navigate(`/learner/course/${courseId}/learn?lessonId=${lessonId}`);
    } else {
        navigate(`/learner/course/${courseId}/learn`);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-10 w-64 bg-[var(--bg-card)] animate-pulse rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[350px] bg-[var(--bg-card)] animate-pulse rounded-2xl border border-[var(--border-subtle)]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
        {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 tracking-tight">My Courses</h1>
            <p className="text-[var(--text-muted)]">Continue where you left off</p>
        </div>
      </div>


      {enrollments?.length > 0 ? (
        /* Grid Layout  */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.map((item) => {
            const { course, progressPercent, status } = item;
            return (
            <div key={item._id} className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden 
             transition-all duration-500 flex flex-col hover:border-emerald-500/50 
             hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:-translate-y-1">
              
              {/* Thumbnail Section */}
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img 
                  src={course.thumbnail || "https://via.placeholder.com/640x360?text=Course+Thumbnail"} 
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                </div>
                {/* Category Tag */}
                <div className="absolute top-4 left-4 bg-[var(--brand-primary)]/90 text-[var(--text-on-brand)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {course.category || 'General'}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                  {course.title}
                </h3>
                
                {/* Instructor  */}
                {course.instructor && (
                    <p className="text-sm text-[var(--text-muted)] mb-6">
                        By <span className="text-slate-300">{course.instructor.name}</span>
                    </p>
                )}

                <div className="mt-auto">
                    {/* Progress Bar Section */}
              
<div className="flex justify-between text-sm mb-2 font-medium">
    <span className={item.progressPercent === 100 ? "text-[var(--brand-primary)]" : "text-[var(--text-main)]"}>
        {item.progressPercent}% Completed
    </span>
    {item.progressPercent === 100 ? (
        <CheckCircle size={18} className="text-emerald-400" />
    ) : (
        <Clock size={18} className="text-slate-500" />
    )}
</div>

{/* --- The Dynamic Progress Bar --- */}
<div className="w-full bg-[var(--bg-input)] h-2.5 rounded-full overflow-hidden mb-6">
    <div 
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out relative"
        style={{ width: `${item.progressPercent}%` }} 
    >
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#10b981]"></div>
    </div>
</div>

{/* --- Action Button --- */}
<button 
    onClick={() => handleContinueBtn(course._id,item.lastAccessedLesson)}
    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
>
    <PlayCircle size={18} fill="currentColor" />
    {item.progressPercent > 0 ? "Continue Learning" : "Start Course"}
</button>
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 bg-[var(--bg-card)] rounded-2xl md:rounded-[2.5rem] border border-dashed border-[var(--border-subtle)]">
          <PlayCircle size={64} className="text-[var(--text-muted)] mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">No courses yet</h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">You haven't enrolled in any courses. Visit the browse page to start your journey.</p>
          <button onClick={() => navigate('/learner/browse')} className="px-8 py-3 bg-[var(--brand-primary)] text-[var(--text-on-brand)] rounded-xl font-bold hover:bg-[var(--brand-primary-hover)] transition-colors">
             Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;