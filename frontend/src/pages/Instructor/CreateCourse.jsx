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

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
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
          const newCourseId = response.data.course._id;

          navigate(`/instructor/course/${newCourseId}/manage`);
        }

      } catch (error) {
        console.error("Creation failed:", error);
        alert(error.response?.data?.message || "Error creating course");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 text-white font-['Poppins']">
      
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-12" 
      >
        <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-2">
          Create Course
        </h1>
        <p className="text-slate-400 text-sm md:text-lg">
          Share your knowledge. Define the <span className="text-emerald-400 font-bold">next generation</span>.
        </p>
      </motion.div>

      {/* --- MAIN FORM --- */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10"> 
          
          {/* LEFT COLUMN: Course Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 space-y-8 relative overflow-hidden backdrop-blur-sm">
              
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
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all text-white"
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
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-base text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
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
                      className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-base text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-500">Select a category</option>
                      <option value="development" className="bg-slate-900 text-white">Development</option>
                      <option value="business" className="bg-slate-900 text-white">Business</option>
                      <option value="design" className="bg-slate-900 text-white">Design</option>
                      <option value="marketing" className="bg-slate-900 text-white">Marketing</option>
                    </select>
                    {/* Custom Arrow for consistency */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
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
                    className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
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
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <ImageIcon size={20} className="text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-widest">Course Thumbnail</span>
              </div>

              <div className={`
                relative border-2 border-dashed rounded-3xl p-4 h-64 flex flex-col items-center justify-center text-center transition-all overflow-hidden group
                ${previewUrl ? 'border-emerald-500/50 bg-black/40' : 'border-white/10 hover:bg-white/[0.02] hover:border-emerald-500/30 cursor-pointer'}
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
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={28} className="text-emerald-400" />
                      </div>
                      <p className="text-slate-400 text-xs font-bold">
                        <span className="text-emerald-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-slate-600 text-[10px] mt-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
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
                className="w-full py-4 rounded-xl bg-emerald-500 text-emerald-950 font-black text-sm uppercase tracking-wider hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create Course"}
              </button>
              
              <button 
                type="button"
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Save as Draft
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5">
              <h4 className="text-emerald-400 font-bold text-sm mb-2">Instructor Tips</h4>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>Use a high-quality 16:9 thumbnail.</li>
                <li>Keep titles concise and action-oriented.</li>
                <li>Select the most relevant category.</li>
              </ul>
            </div>

          </motion.div>
        </div>
      </form>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const InputGroup = ({ label, icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 ml-1">
      <span className="text-slate-500">{icon}</span>
      <label className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</label>
    </div>
    {children}
  </div>
);

export default CreateCourse;