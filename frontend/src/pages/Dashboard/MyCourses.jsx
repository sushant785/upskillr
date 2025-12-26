import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // 1. Retrieve Token directly
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Handle case where user isn't logged in
            console.error("No token found");
            return;
        }

        // 2. Make authenticated request directly
        const response = await axios.get('http://localhost:5000/api/learner/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("DEBUG: My Enrollments ->", response.data);
        setEnrollments(response.data.courses || []);
      } catch (err) {
        console.error("Error fetching my courses:", err);
        // Optional: redirect to login if 401 error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const handleContinueBtn = (courseId) => {
      // Future: navigate to the course player page
      console.log(`Continuing course: ${courseId}`);
      // navigate(`/dashboard/course/${courseId}/learn`);
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
            <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
            <p className="text-[var(--text-muted)]">Continue where you left off</p>
        </div>
      </div>


      {enrollments?.length > 0 ? (
        /* Grid Layout adapted from inspiration image */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.map((item) => {
            const { course, progressPercent, status } = item;
            return (
            <div key={item._id} className="group flex flex-col bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--brand-primary)] transition-all duration-300">
              
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
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
                  {course.title}
                </h3>
                
                {/* Instructor - Optional if you have this data populated */}
                {course.instructor && (
                    <p className="text-sm text-[var(--text-muted)] mb-6">
                        By <span className="text-slate-300">{course.instructor.name}</span>
                    </p>
                )}

                <div className="mt-auto">
                    {/* Progress Bar Section */}
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className={status === 'completed' ? "text-[var(--brand-primary)]" : "text-white"}>
                            {progressPercent || 0}% Completed
                        </span>
                        {status === 'completed' ? (
                            <CheckCircle size={18} className="text-[var(--brand-primary)]" />
                        ) : (
                            <Clock size={18} className="text-[var(--text-muted)]" />
                        )}
                    </div>
                    <div className="w-full bg-slate-700/50 h-2.5 rounded-full overflow-hidden mb-6">
                        <div 
                            className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] transition-all duration-700 ease-out relative"
                            style={{ width: `${progressPercent || 0}%` }}
                        >
                            {/* Glow effect at the end of the progress bar */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_var(--brand-primary)]"></div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={() => handleContinueBtn(course._id)}
                        className="w-full py-3 bg-[var(--brand-primary)] text-[var(--text-on-brand)] rounded-xl font-bold hover:bg-[var(--brand-primary-hover)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <PlayCircle size={18} fill="currentColor" />
                        {progressPercent > 0 ? "Continue Learning" : "Start Course"}
                    </button>
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 bg-[var(--bg-card)] rounded-3xl border border-dashed border-[var(--border-subtle)]">
          <PlayCircle size={64} className="text-[var(--text-muted)] mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">No courses yet</h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">You haven't enrolled in any courses. Visit the browse page to start your journey.</p>
          <a href="/dashboard/browse" className="px-8 py-3 bg-[var(--brand-primary)] text-[var(--text-on-brand)] rounded-xl font-bold hover:bg-[var(--brand-primary-hover)] transition-colors">
            Browse Courses
          </a>
        </div>
      )}
    </div>
  );
};

export default MyCourses;