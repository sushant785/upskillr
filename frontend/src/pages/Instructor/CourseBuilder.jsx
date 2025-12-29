import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, PlayCircle, FileText, 
  Trash2, GripVertical, 
  ChevronDown, ChevronRight, Save,
  Video, Globe, Loader2, X, Paperclip
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios'; 
import api from '../../utils/api'; 

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('curriculum');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  
  const [expandedModules, setExpandedModules] = useState({});
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  
  const [lessonForm, setLessonForm] = useState({ 
    title: '', 
    video: null, 
    resource: null 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, curriculumRes] = await Promise.all([
          api.get(`/instructor/courses/${courseId}`),
          api.get(`/instructor/courses/${courseId}/curriculum`)
        ]);

        setCourse(courseRes.data.course);
        setSections(curriculumRes.data.sections || []);

        const expandedState = {};
        if (curriculumRes.data.sections) {
            curriculumRes.data.sections.forEach(sec => expandedState[sec._id] = true);
        }
        setExpandedModules(expandedState);

      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);


  // --- HANDLE LESSON UPLOAD (MATCHING YOUR BACKEND) ---
  const handleUploadLesson = async () => {
    if (!lessonForm.title || !lessonForm.video) {
      return toast.error("Title and Video are required");
    }

    if (!lessonForm.resource) {
       return toast.error("Attachment/Resource is required by backend");
    }

    setUploading(true);
    const toastId = toast.loading("Initializing upload...");

    try {

      const currentSection = sections.find(s => s._id === currentSectionId);
      const nextOrder = currentSection ? currentSection.lessons.length + 1 : 1;

      const { data } = await api.post('/instructor/video-upload-url', {
        course: courseId,              
        sectionId: currentSectionId,   
        title: lessonForm.title,      
        order: nextOrder,             
        fileTypeMain: lessonForm.video.type,  
        fileTypeResource: lessonForm.resource.type 
      });
      toast.loading("Uploading files to S3...", { id: toastId });     
      const uploadPromises = []; 
      if (data.uploadUrlMain && lessonForm.video) {
        uploadPromises.push(
          axios.put(data.uploadUrlMain, lessonForm.video, {
            headers: { "Content-Type": lessonForm.video.type }
          })
        );
      }

      if (data.uploadUrlResource && lessonForm.resource) {
        uploadPromises.push(
          axios.put(data.uploadUrlResource, lessonForm.resource, {
            headers: { "Content-Type": lessonForm.resource.type }
          })
        );
      }

      await Promise.all(uploadPromises);

      const newLesson = {
        _id: data.lessonId, 
        title: lessonForm.title,
        type: 'video',
        videoUrl: data.fileKeyMain,
        order: data.lesson_order
      };

      setSections(prev => prev.map(sec => {
        if (sec._id === currentSectionId) {
            return { ...sec, lessons: [...(sec.lessons || []), newLesson] };
        }
        return sec;
      }));

      toast.success("Lesson created successfully!", { id: toastId });
      setIsAddingLesson(false);
      setLessonForm({ title: '', video: null, resource: null });

    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };


  // --- OTHER ACTIONS (Publish, Delete, Sections) ---
  const handlePublishToggle = async () => {
    try {
      const { data } = await api.patch(`/instructor/courses/${courseId}/publish`);
      setCourse(prev => ({ ...prev, isPublished: !prev.isPublished }));
      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Are you sure? This will delete all lessons and sections.")) return;
    try {
      await api.delete(`/instructor/courses/${courseId}`);
      toast.success("Course deleted");
      navigate('/instructor/dashboard');
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData(e.target);
      await api.put(`/instructor/courses/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { data } = await api.get(`/instructor/courses/${courseId}`);
      setCourse(data.course);
      toast.success("Settings updated!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setUploading(false);
    }
  };

  const handleAddSection = async () => {
    const title = prompt("Enter Module Title:");
    if (!title) return;
    try {
      const { data } = await api.post(`/instructor/courses/${courseId}/sections`, { 
        title, 
        order: sections.length + 1 
      });
      setSections([...sections, { ...data.section, lessons: [] }]);
      setExpandedModules(prev => ({ ...prev, [data.section._id]: true }));
      toast.success("Module added");
    } catch (error) {
      toast.error("Failed to add module");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Delete this module and all its lessons?")) return;
    try {
      await api.delete(`/instructor/courses/${courseId}/sections/${sectionId}`);
      setSections(sections.filter(sec => sec._id !== sectionId));
      toast.success("Module deleted");
    } catch (error) {
      toast.error("Failed to delete module");
    }
  };

  const handleDeleteLesson = async (lessonId, sectionId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/instructor/videos/${lessonId}`);
      setSections(prev => prev.map(sec => {
        if (sec._id === sectionId) {
            return { ...sec, lessons: sec.lessons.filter(l => l._id !== lessonId) };
        }
        return sec;
      }));
      toast.success("Lesson deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };


  // --- RENDER ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  if (!course) return <div className="text-white text-center mt-20">Course Not Found</div>;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 text-white font-['Poppins']">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${course.isPublished ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
              {course.isPublished ? 'Published' : 'Draft Mode'}
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{course.title}</h1>
          </div>
          <p className="text-slate-400 text-sm">Manage your curriculum and content.</p>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={handlePublishToggle}
                className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${course.isPublished ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-400' : 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400'}`}
            >
                <Globe size={18} /> {course.isPublished ? 'Unpublish' : 'Publish Course'}
            </button>
        </div>
      </header>

      {/* TABS */}
      <div className="flex gap-8 mb-8 border-b border-white/5 text-sm font-bold text-slate-500">
        <button onClick={() => setActiveTab('curriculum')} className={`pb-4 transition-colors ${activeTab === 'curriculum' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'hover:text-white'}`}>Curriculum</button>
        <button onClick={() => setActiveTab('settings')} className={`pb-4 transition-colors ${activeTab === 'settings' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'hover:text-white'}`}>Course Settings</button>
      </div>

      {/* --- CURRICULUM TAB --- */}
      {activeTab === 'curriculum' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          <div className="space-y-4">
            {sections.length === 0 && <div className="text-slate-500 text-center py-10 bg-white/5 rounded-2xl">No modules yet. Click below to add one.</div>}

            {sections.map((section) => (
              <div key={section._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 bg-white/[0.02] flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4 cursor-pointer select-none" onClick={() => setExpandedModules(p => ({...p, [section._id]: !p[section._id]}))}>
                    <div className="p-2 bg-white/5 rounded-lg text-slate-400"><GripVertical size={16} /></div>
                    <h3 className="font-bold text-lg text-slate-200">{section.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDeleteSection(section._id)} className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg"><Trash2 size={16} /></button>
                    <button onClick={() => setExpandedModules(p => ({...p, [section._id]: !p[section._id]}))} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                       {expandedModules[section._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedModules[section._id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5">
                      <div className="p-4 space-y-3">
                        {(!section.lessons || section.lessons.length === 0) && <p className="text-xs text-slate-500 italic pl-2">No lessons yet.</p>}

                        {section.lessons && section.lessons.map((lesson) => (
                          <div key={lesson._id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 group">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><PlayCircle size={18} /></div>
                              <h4 className="text-sm font-bold text-slate-200">{lesson.title}</h4>
                            </div>
                            <button onClick={() => handleDeleteLesson(lesson._id, section._id)} className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <button onClick={() => { setCurrentSectionId(section._id); setIsAddingLesson(true); }} className="w-full py-3 rounded-xl border border-dashed border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.02] hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2">
                          <Plus size={16} /> Add Lesson
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <button onClick={handleAddSection} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Plus size={20} /> Add New Module
          </button>
        </motion.div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
            <form onSubmit={handleUpdateSettings} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase">Course Title</label>
                    <input name="title" defaultValue={course.title} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase">Description</label>
                    <textarea name="description" rows={5} defaultValue={course.description} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none resize-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase">Category</label>
                        <select name="category" defaultValue={course.category || "Web Development"} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors">
                            <option value="Web Development">Web Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Business">Business</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase">Price</label>
                        <input type="number" name="price" defaultValue={course.price} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase">Thumbnail</label>
                    <div className="flex items-center gap-4">
                         {course.thumbnail && course.thumbnail.length > 0 ? (
                            <img src={course.thumbnail} alt="preview" className="w-32 h-20 object-cover rounded-lg border border-white/10" />
                        ) : (
                            <div className="w-32 h-20 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 text-xs">No Image</div>
                        )}
                        <input type="file" name="thumbnail" accept="image/*" className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" />
                    </div>
                </div>
                <button type="submit" disabled={uploading} className="w-full py-4 bg-emerald-500 text-emerald-950 font-bold rounded-xl hover:bg-emerald-400 flex items-center justify-center gap-2 transition-all">
                    {uploading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                </button>
            </form>

            <div className="mt-8 p-8 border border-red-500/20 bg-red-500/5 rounded-[2rem]">
                <h3 className="text-red-500 font-bold text-lg mb-2">Danger Zone</h3>
                <p className="text-slate-400 text-sm mb-6">Deleting this course will remove all sections and lessons permanently.</p>
                <button onClick={handleDeleteCourse} className="px-6 py-3 bg-red-500/10 border border-red-500/50 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                    <Trash2 size={18} /> Delete Course
                </button>
            </div>
        </motion.div>
      )}

      {/* --- ADD LESSON MODAL (UPDATED WITH ATTACHMENT) --- */}
      {isAddingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsAddingLesson(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
            <h3 className="text-xl font-bold mb-6">Add New Lesson</h3>
            
            <div className="space-y-5">
              
              {/* 1. Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase">Lesson Title</label>
                <input 
                    type="text" 
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    placeholder="e.g. Intro to Hooks" 
                />
              </div>

              {/* 2. Video Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                   <Video size={14} /> Video File (Required)
                </label>
                <input 
                    type="file" 
                    accept="video/*"
                    onChange={(e) => setLessonForm({...lessonForm, video: e.target.files[0]})}
                    className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer" 
                />
              </div>

              {/* 3. Attachment Input (REQUIRED by Backend) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                   <Paperclip size={14} /> Attachment / Resource (Required)
                </label>
                <input 
                    type="file" 
                    // Accepting common formats; adjust as needed
                    accept=".pdf,.zip,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => setLessonForm({...lessonForm, resource: e.target.files[0]})}
                    className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer" 
                />
                <p className="text-[10px] text-slate-500">Must upload a file (PDF, Zip, Image) to create lesson.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setIsAddingLesson(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-colors">Cancel</button>
                <button 
                    onClick={handleUploadLesson} 
                    disabled={uploading}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : 'Upload Lesson'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default CourseBuilder;