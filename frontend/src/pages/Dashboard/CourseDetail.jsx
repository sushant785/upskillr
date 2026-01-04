

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  PlayCircle, Clock, Globe, Users, 
  Award, ShieldCheck, CheckCircle2, ChevronRight 
} from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/learner/course/${courseId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [courseId]);

  if (loading) return <div className="min-h-screen bg-[var(--bg-main)] animate-pulse" />;
  
  const { course, isEnrolled } = data;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-['Poppins'] transition-colors duration-300">
      
      {/* Hero Header */}
      <div className="bg-[var(--bg-card)] py-12 px-6 md:px-20 border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <nav className="flex gap-2 text-emerald-500 text-xs font-bold mb-4 uppercase tracking-widest">
              <span>Development</span> <ChevronRight size={14} /> <span>Web Dev</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tighter">
              {course.title}
            </h1>
            <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed max-w-2xl font-medium">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm font-bold text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-500"/> 85k Students
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-emerald-500"/> 52 Hours Content
              </div>
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-emerald-500"/> English
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Card */}
          <div className="relative">
            <div className="lg:absolute lg:top-0 w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl overflow-hidden">
              <img 
                src={course.thumbnail} 
                className="w-full aspect-video rounded-xl object-cover mb-6 border border-[var(--border-subtle)]" 
                alt="Preview" 
              />
              <div className="text-3xl font-black mb-2 text-[var(--text-main)]">
                ${course.price} 
                <span className="text-sm text-[var(--text-muted)] line-through font-normal ml-2">$199</span>
              </div>
              <p className="text-emerald-500 text-xs font-black mb-6 tracking-widest uppercase">
                75% OFF - Limited Time
              </p>
              
              {isEnrolled ? (
                <button 
                  onClick={() => navigate(`/learner/course/${courseId}/player`)}
                  className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <PlayCircle size={20} /> Go to Course Player
                </button>
              ) : (
                <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20">
                  Enroll Now
                </button>
              )}
              
              <div className="mt-8">
                <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-4 tracking-widest">
                  This course includes:
                </p>
                <ul className="space-y-3 text-sm text-[var(--text-muted)] font-medium">
                  <li className="flex items-center gap-3"><PlayCircle size={16} className="text-emerald-500" /> 52 hours on-demand video</li>
                  <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-emerald-500" /> Full lifetime access</li>
                  <li className="flex items-center gap-3"><Award size={16} className="text-emerald-500" /> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 md:px-20 py-16">
        <div className="lg:w-2/3">
          <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-subtle)] mb-12 shadow-sm">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">What you'll learn</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Note: In a real app, map through course.learningOutcomes if available */}
              {['Build 16 web projects', 'Master modern ES6+', 'Work with MongoDB', 'Deploy to production'].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[var(--text-muted)] font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Course Content</h3>
          <div className="space-y-4">
            {course.sections.map((section, idx) => (
              <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 hover:border-emerald-500/40 transition-all cursor-pointer group">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-emerald-500 uppercase tracking-tighter transition-transform inline-block">
                    Section {idx+1}: {section.title}
                  </span>
                  <span className="text-[var(--text-muted)] opacity-60 font-medium">{section.lessons.length} lectures</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;