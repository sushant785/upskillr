import React, { useState } from 'react';
import api from "../../utils/api.js"
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  IndianRupee,
  Layout, 
  Type, 
  FileText,
  Image as ImageIcon,
  Loader2,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    thumbnail: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.title || !formData.category || !formData.price) {
          toast.warning("Please fill in all required fields.");
          return;
      }

      setLoading(true);

      try {
 
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('price', formData.price);
        if (formData.thumbnail) {
          data.append('thumbnail', formData.thumbnail);
        }

        const response = await api.post('/instructor/courses', data)

        if (response.data && response.data.course) {
          toast.success("Course draft created! Let's build the content.");
          const newCourseId = response.data.course._id;
          setTimeout(() => {
             navigate(`/instructor/course/${newCourseId}/manage`);
          }, 1000);
        }

      } catch (error) {
        console.error("Creation failed:", error);
        const errorMsg = "Failed to create course.";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

  return (
    // Root container uses bg-main
    <div className="w-full min-h-screen bg-[var(--bg-main)] transition-colors duration-300 font-['Poppins']">
        <div className="max-w-7xl mx-auto p-6 md:p-12 text-[var(--text-main)]">
      
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12" 
      >
        <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">
          Create Course
        </h1>
        <p className="text-[var(--text-muted)] text-sm md:text-lg">
          Share your knowledge. Define the <span className="text-emerald-500 font-bold">next generation</span>.
        </p>
      </motion.div>

      {/* --- MAIN FORM --- */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10"> 
          
          {/* LEFT COLUMN: Course Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* CARD: Uses bg-card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2rem] p-8 md:p-10 space-y-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
              
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

              {/* Title Input */}
              <InputGroup 
                label="Course Title" 
                icon={<Type size={18} />}
              >
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Advanced Fullstack Architecture" 
                  // INPUT: Uses bg-input
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-5 text-lg font-bold placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500/50 transition-all text-[var(--text-main)]"
                  required
                />
              </InputGroup>

              {/* Description Input */}
              <InputGroup 
                label="Description" 
                icon={<FileText size={18} />}
              >
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="What will students learn in this course?"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                  required
                />
              </InputGroup>

              {/* Category & Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
                
                <InputGroup label="Category" icon={<Layout size={18} />}>
                  {/* Fixed Dropdown Styling */}
                  <div className="relative">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-5 text-base text-[var(--text-main)] focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                      required
                    >
                      {/* Options usually need a solid background in dark mode to be readable */}
                      <option value="" disabled className="bg-[var(--bg-base-solid)] text-[var(--text-muted)]">Select a category</option>
                      <option value="development" className="bg-[var(--bg-base-solid)] text-[var(--text-main)]">Development</option>
                      <option value="business" className="bg-[var(--bg-base-solid)] text-[var(--text-main)]">Business</option>
                      <option value="design" className="bg-[var(--bg-base-solid)] text-[var(--text-main)]">Design</option>
                      <option value="marketing" className="bg-[var(--bg-base-solid)] text-[var(--text-main)]">Marketing</option>
                    </select>
                    {/* Custom Arrow for consistency */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                </InputGroup>

                <InputGroup label="Price (₹)" icon={<IndianRupee size={18} />}>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="499"
                    min="0"
                    step="1"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-emerald-500/50 transition-all"
                    required
                  />
                </InputGroup>
              </div>

            </div>
          </motion.div>

          {/* RIGHT COLUMN: Thumbnail & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="space-y-8" 
          >
            
            {/* Thumbnail Upload Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                <ImageIcon size={20} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest">Course Thumbnail</span>
              </div>

              <div className={`
                relative border-2 border-dashed rounded-3xl p-4 h-64 flex flex-col items-center justify-center text-center transition-all overflow-hidden group
                ${previewUrl ? 'border-emerald-500/50 bg-[var(--bg-input)]' : 'border-[var(--border-subtle)] hover:bg-[var(--bg-input)] hover:border-emerald-500/30 cursor-pointer'}
              `}>
                
                <AnimatePresence>
                  {previewUrl ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img src={previewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <div className="w-14 h-14 rounded-full bg-[var(--bg-main)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm border border-[var(--border-subtle)]">
                        <UploadCloud size={28} className="text-emerald-500" />
                      </div>
                      <p className="text-[var(--text-muted)] text-xs font-bold">
                        <span className="text-emerald-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[var(--text-muted)] text-[10px] mt-2 opacity-70">SVG, PNG, JPG (max. 800x400px)</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!previewUrl && (
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-emerald-500 text-white font-black text-sm uppercase tracking-wider hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create Course"}
              </button>
              
              <button 
                type="button"
                className="w-full py-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm uppercase tracking-wider hover:bg-[var(--bg-card)] transition-all"
              >
                Save as Draft
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5">
              <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2">Instructor Tips</h4>
              <ul className="text-xs text-[var(--text-muted)] space-y-2 list-disc list-inside">
                <li>Use a high-quality 16:9 thumbnail.</li>
                <li>Keep titles concise and action-oriented.</li>
                <li>Select the most relevant category.</li>
              </ul>
            </div>

          </motion.div>
        </div>
      </form>
    </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const InputGroup = ({ label, icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 ml-1">
      <span className="text-[var(--text-muted)]">{icon}</span>
      <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</label>
    </div>
    {children}
  </div>
);

export default CreateCourse;