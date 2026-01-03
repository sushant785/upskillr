import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../../utils/api';
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Star // <--- 1. IMPORT ADDED
} from 'lucide-react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]); 
  const [showCelebration, setShowCelebration] = useState(false);
  const initialLessonId = searchParams.get('lessonId'); 


  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/learner/course/${courseId}`);
        const { course, completedLessons, progressPercent } = response.data;

        if (progressPercent === 100) {
           // triggerConfetti(); 
        }
        
        setCourse(course);
        setCompletedLessons(completedLessons || []); 

        let targetLesson = null;
        let targetSectionId = null;

        // 1. Try to find the specific lesson from URL
        if (initialLessonId) {
          for (const section of course.sections) {
            const found = section.lessons?.find(l => l._id === initialLessonId);
            if (found) {
              targetLesson = found;
              targetSectionId = section._id;
              break; 
            }
          }
        }

        // 2. If found, play it. If not, default to the very first lesson.
        if (targetLesson) {
          setCurrentLesson(targetLesson);
          setExpandedSections({ [targetSectionId]: true });
        } else if (course.sections?.length > 0) {
          const firstSection = course.sections[0];
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


  useEffect(() => {
    if (courseId && currentLesson?._id) {
      api.put('/learner/progress/mark', { 
        courseId, 
        lessonId: currentLesson._id 
      }).catch(err => console.error("Failed to update bookmark:", err));
    }
  }, [courseId, currentLesson?._id]);


  const playNextLesson = () => {
    if (!course || !currentLesson) return;
    const allLessons = course.sections.flatMap(section => section.lessons);
    const currentIndex = allLessons.findIndex(l => l._id === currentLesson._id);

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
      setExpandedSections(prev => ({ ...prev, [nextLesson.section]: true }));
    }
  };


  const toggleLessonStatus = async (lessonId) => {
    try {
      const response = await api.post('/learner/update-progress', { courseId, lessonId });
      setCompletedLessons(response.data.completedLessons);
      if (response.data.progressPercent === 100) {
        triggerConfetti();
        setShowCelebration(true);
      }
    } catch (err) {
      console.error("Error toggling progress:", err);
    }
  };


  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#31e6faff','#d2e146ff','#db2c7dff'] 
    });
  };


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
          
          {/* --- 2. NEW REVIEW BUTTON --- */}
          <button 
            onClick={() => navigate(`/learner/course/${courseId}/review`)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 group"
          >
            <Star size={16} className="text-yellow-500 group-hover:fill-yellow-500 transition-colors duration-300" />
            <span className="text-[10px] font-black uppercase tracking-widest">Rate Course</span>
          </button>
          {/* --------------------------- */}

          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Progress</p>
            {(() => {
                const totalLessons = course?.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
                const percent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
                return (
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${percent}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-white">{percent}%</span>
                  </div>
                );
            })()}
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
                className="w-full h-full"
                onEnded={playNextLesson} 
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-900">
                <PlayCircle size={64} className="opacity-20 animate-pulse" />
              </div>
            )}
          </div>

         <div className="p-8 max-w-4xl">
  
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter border border-emerald-500/20 w-fit">
                Currently Playing
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {currentLesson?.title}
              </h2>
            </div>

            {/* <button 
              onClick={() => toggleLessonStatus(currentLesson?._id)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-black uppercase hover:bg-emerald-500 hover:text-white transition-all duration-300"
            >
              <CheckCircle size={18} />
              {completedLessons.includes(currentLesson?._id) ? "Marked as Done" : "Mark as Completed"}
            </button> */}
          </div>
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
                        <div 
        key={lesson._id} 
        className={`flex items-center gap-4 p-4 pl-8 border-b border-slate-800/30 group ${
          currentLesson?._id === lesson._id ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''
        }`}
      >
        {/* Checkbox Toggle */}
        <input 
          type="checkbox"
          checked={completedLessons.includes(lesson._id)}
          onChange={() => toggleLessonStatus(lesson._id)}
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
        />
        
        <button onClick={() => setCurrentLesson(lesson)} className="flex-grow text-left">
          <p className={`text-xs font-bold leading-relaxed ${
            currentLesson?._id === lesson._id ? 'text-emerald-400' : 'text-slate-300'
          }`}>
            {lesson.title}
          </p>
        </button>
      </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* --- Celebration Modal --- */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-emerald-500/30 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-emerald-400" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Course Completed!</h2>
            <p className="text-slate-400 mb-8 font-medium">
              Incredible work! You've successfully mastered all the modules in <span className="text-emerald-400">"{course?.title}"</span>.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/learner/my-courses')}
                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                View My Courses
              </button>
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold transition-colors"
              >
                Keep Re-watching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;