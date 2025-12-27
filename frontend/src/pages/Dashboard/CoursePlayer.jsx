import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  ExternalLink 
} from 'lucide-react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
       
        const response = await api.get(`/learner/course/${courseId}`);
        const courseData = response.data.course;
        
        setCourse(courseData);

        if (courseData.sections?.length > 0) {
          const firstSection = courseData.sections[0];
          if (firstSection.lessons?.length > 0) {
            setCurrentLesson(firstSection.lessons[0]);
            setExpandedSections({ [firstSection._id]: true });
          }
        }
      } catch (err) {
        console.error("Failed to load course content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId]);


  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">BOOTING PLAYER...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white font-['Poppins']">
      
      {/* --- Top Navigation Bar --- */}
      <nav className="h-16 bg-[#1e293b] border-b border-slate-800 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/learner/my-courses')} 
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
          >
            <ChevronLeft size={24} className="group-hover:text-emerald-400" />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter text-emerald-400 leading-none">Upskillr Player</h1>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[300px]">{course?.title}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Progress</p>
            <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '0%' }}></div>
              </div>
              <span className="text-xs font-bold text-white">0%</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-grow overflow-hidden">
        
        {/* --- Video Area  --- */}
        <main className="flex-grow overflow-y-auto bg-black flex flex-col">
          <div className="aspect-video bg-black w-full relative shadow-2xl">
            {currentLesson?.videoUrl ? (
              <video 
                key={currentLesson._id}
                src={currentLesson.videoUrl} 
                controls
                controlsList="nodownload"
                className="w-full h-full"
                autoPlay
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-900">
                <PlayCircle size={64} className="opacity-20 animate-pulse" />
              </div>
            )}
          </div>

          <div className="p-8 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter border border-emerald-500/20">
                 Currently Playing
               </span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{currentLesson?.title}</h2>
            <p className="text-slate-400 leading-relaxed text-sm font-medium border-l-2 border-slate-800 pl-6 py-2">
              {course?.description}
            </p>

            {/* Resources Section */}
            {(currentLesson?.resourceUrl || currentLesson?.attachment) && (
              <div className="mt-8 pt-8 border-t border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Lesson Resources</h4>
                <div className="flex flex-wrap gap-4">
                  {currentLesson.resourceUrl && (
                    <a href={currentLesson.resourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all border border-slate-700">
                      <ExternalLink size={16} className="text-emerald-400" /> External Resource
                    </a>
                  )}
                  {currentLesson.attachment && (
                    <a href={currentLesson.attachment} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all border border-slate-700">
                      <FileText size={16} className="text-blue-400" /> Attachment
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* --- Course Content Sidebar --- */}
        <aside className="w-[400px] shrink-0 bg-[#1e293b] border-l border-slate-800 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Course Content</h3>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {course?.sections?.map((section, sIndex) => {
              const isExpanded = expandedSections[section._id];
              return (
                <div key={section._id} className="border-b border-slate-800/50">
                  {/* Section Header Accordion */}
                  <button 
                    onClick={() => toggleSection(section._id)}
                    className="w-full p-5 flex items-center justify-between bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter mb-1">Section {sIndex + 1}</p>
                      <h4 className="text-sm font-bold text-white leading-tight">{section.title}</h4>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                  </button>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="bg-[#1e293b]">
                      {section.lessons?.map((lesson, lIndex) => (
                        <button 
                          key={lesson._id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full p-4 pl-8 flex items-start gap-4 hover:bg-slate-700/30 transition-all border-b border-slate-800/30 group ${
                            currentLesson?._id === lesson._id ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''
                          }`}
                        >
                          <div className="mt-1 shrink-0">
                            {currentLesson?._id === lesson._id ? (
                                <PlayCircle size={16} className="text-emerald-400 fill-emerald-400/20" />
                            ) : (
                                <PlayCircle size={16} className="text-slate-600 group-hover:text-slate-400" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className={`text-xs font-bold leading-relaxed ${
                              currentLesson?._id === lesson._id ? 'text-emerald-400' : 'text-slate-300'
                            }`}>
                              {lesson.title}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CoursePlayer;