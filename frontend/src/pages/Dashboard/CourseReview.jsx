import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Star, MessageSquare, Send, CheckCircle, 
  AlertCircle, Loader2, ThumbsUp, ArrowLeft,
  Sparkles, Lock
} from 'lucide-react';
import api from '../../utils/api'; 

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const starVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2, rotate: 10, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.8, rotate: -10 }
};

const shakeTransition = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

const CourseReviewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Data State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false); // Triggers error shake

  // Fetch Logic
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/learner/course/${courseId}`);
        setCourse(response.data.course || response.data); 
      } catch (err) {
        console.error("Failed to load protocol data:", err);
        setError("System Link Failed. Course data unavailable.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseDetails();
  }, [courseId]);

  // Validation & Submission
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#34d399', '#10b981', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0 || reviewText.trim().length < 5) {
      if (rating === 0) setError("Rating parameter missing.");
      else setError("Log entry too short (min 5 chars).");
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    try {
      const storedAuth = localStorage.getItem('auth');
      const authData = storedAuth ? JSON.parse(storedAuth) : null;
      const userId = authData?.user?._id || authData?.user?.id;

      if (!userId) throw new Error("Authentication link severed.");

      await api.post('/review/post-review', {
        user: userId,
        course: courseId,
        rating: rating,
        comment: reviewText
      });
      
      setIsSubmitted(true);
      triggerConfetti();
    } catch (err) {
      const msg = err.response?.data?.message || "Transmission failed.";
      setError(msg);
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />
        <Loader2 className="animate-spin text-emerald-400 relative z-10" size={50} />
        <p className="text-emerald-500/50 text-xs font-mono mt-4 animate-pulse relative z-10">INITIALIZING HANDSHAKE...</p>
      </div>
    );
  }

  const instructorName = course?.instructor?.name || 'System Admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="max-w-6xl w-full mx-auto">
          
          {/* Header Area */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
                <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-emerald-500/50 transition-all">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Abort Mission</span>
            </button>
            
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live Feed
            </div>
          </motion.header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            
            {/* Left Column: Course Context (4 Cols) */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] opacity-30 group-hover:opacity-60 blur transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden h-full">
                  
                  {/* Image Container with Parallax-like feel on hover */}
                  <div className="rounded-2xl overflow-hidden mb-6 aspect-video relative shadow-2xl border border-white/5">
                    {course?.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt="Course" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Lock className="text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  </div>

                  <h2 className="text-3xl font-black text-white mb-2 leading-tight tracking-tight">
                    {course?.title || "Unknown Protocol"}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6 border-l-2 border-emerald-500 pl-3">
                    Overlord: <span className="text-slate-200 font-semibold">{instructorName}</span>
                  </p>

                  {/* Tips Box */}
                  <div className="bg-slate-950/50 rounded-xl p-5 border border-white/5 backdrop-blur-sm">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                      <Sparkles size={14} /> Directive
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li className="flex gap-2">
                        <CheckCircle size={14} className="text-slate-600 shrink-0" /> Focus on skill acquisition.
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle size={14} className="text-slate-600 shrink-0" /> Critique the difficulty curve.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Form (7 Cols) */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <motion.div 
                animate={shake ? shakeTransition : {}}
                className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative h-full flex flex-col justify-center"
              >
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      {/* Rating Section */}
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <h3 className="font-black text-xl uppercase italic text-white flex items-center gap-2">
                            Rate Experience
                          </h3>
                          <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                            hoverRating ? 'text-emerald-400' : 'text-slate-600'
                          }`}>
                            {hoverRating === 1 && "Critical Failure"}
                            {hoverRating === 2 && "Sub-optimal"}
                            {hoverRating === 3 && "Acceptable"}
                            {hoverRating === 4 && "Superior"}
                            {hoverRating === 5 && "Legendary"}
                            {!hoverRating && rating === 0 && "Select Rating"}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 p-4 bg-slate-950/50 rounded-2xl border border-white/5 justify-between max-w-md">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              variants={starVariants}
                              initial="initial"
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none cursor-pointer p-1"
                            >
                              <Star 
                                size={36} 
                                weight="fill"
                                className={`transition-all duration-300 ${
                                  star <= (hoverRating || rating) 
                                    ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                                    : "text-slate-700 fill-transparent"
                                }`} 
                              />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Comment Section */}
                      <div>
                        <h3 className="font-black text-xl uppercase italic text-white mb-4 flex items-center gap-2">
                          <MessageSquare className="text-emerald-400" size={20} /> Tactical Analysis
                        </h3>
                        <div className="relative group">
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Data entry required. Describe your experience..."
                            className="w-full h-40 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none placeholder:text-slate-600 cursor-text"
                          />
                          {/* Character Count Progress Bar */}
                          <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 rounded-b-2xl transition-all duration-300" 
                               style={{ width: `${Math.min((reviewText.length / 50) * 100, 100)}%`, opacity: reviewText.length > 0 ? 1 : 0 }} 
                          />
                          <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-600 uppercase">
                             {reviewText.length} chars
                          </div>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                          {error && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-2 mt-4 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                            >
                              <AlertCircle size={16} />
                              <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Action Button */}
                      <motion.button 
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        disabled={isSubmitting}
                        className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <>
                            Submit Review <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    // Success View
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="flex flex-col items-center justify-center text-center space-y-8 py-10"
                    >
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                        className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                      >
                        <CheckCircle size={56} className="text-white drop-shadow-lg" />
                      </motion.div>

                      <div>
                        <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
                          Upload Complete
                        </h2>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                          Your tactical analysis has been encrypted and stored in the mainframe.
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <motion.button 
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => navigate('/learner/my-courses')}
                           className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest transition-all border border-white/10 hover:border-emerald-500/50 cursor-pointer"
                        >
                            Return to Base
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CourseReviewPage;