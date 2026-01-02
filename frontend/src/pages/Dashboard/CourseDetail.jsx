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

  if (loading) return <div className="min-h-screen bg-[#0f172a] animate-pulse" />;
  const { course, isEnrolled } = data;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-['Poppins']">
      {/* Hero Header */}
      <div className="bg-[#1e293b] py-12 px-6 md:px-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <nav className="flex gap-2 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
              <span>Development</span> <ChevronRight size={14} /> <span>Web Dev</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{course.title}</h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-2xl">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm font-medium">
              <div className="flex items-center gap-2"><Users size={18} className="text-emerald-400"/> 85k Students</div>
              <div className="flex items-center gap-2"><Clock size={18} className="text-emerald-400"/> 52 Hours Content</div>
              <div className="flex items-center gap-2"><Globe size={18} className="text-emerald-400"/> English</div>
            </div>
          </div>

          {/* Sticky Sidebar Card */}
          <div className="relative">
            <div className="lg:absolute lg:top-0 w-full bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
              <img src={course.thumbnail} className="w-full aspect-video rounded-xl object-cover mb-6 border border-slate-700" alt="Preview" />
              <div className="text-3xl font-black mb-2">${course.price} <span className="text-sm text-slate-500 line-through font-normal">$199</span></div>
              <p className="text-emerald-400 text-xs font-bold mb-6 italic">75% OFF - Limited Time</p>
              
              {isEnrolled ? (
                <button 
                  onClick={() => navigate(`/learner/course/${courseId}/player`)}
                  className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle size={20} /> Go to Course Player
                </button>
              ) : (
                <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase hover:bg-emerald-600 transition-all">
                  Enroll Now
                </button>
              )}
              
              <div className="mt-8">
                <p className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">This course includes:</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-3"><PlayCircle size={16} /> 52 hours on-demand video</li>
                  <li className="flex items-center gap-3"><ShieldCheck size={16} /> Full lifetime access</li>
                  <li className="flex items-center gap-3"><Award size={16} /> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 md:px-20 py-16">
        <div className="lg:w-2/3">
          <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 mb-12">
            <h3 className="text-xl font-black mb-6">What you'll learn</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {['Build 16 web projects', 'Master modern ES6+', 'Work with MongoDB', 'Deploy to production'].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-black mb-8">Course Content</h3>
          <div className="space-y-4">
            {course.sections.map((section, idx) => (
              <div key={idx} className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-emerald-400">Section {idx+1}: {section.title}</span>
                  <span className="text-slate-500">{section.lessons.length} lectures</span>
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