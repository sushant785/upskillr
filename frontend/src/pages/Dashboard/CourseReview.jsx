

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Star, MessageSquare, Send, CheckCircle, 
  AlertCircle, Loader2, ArrowLeft,
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
  hover: { scale: 1.2, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.8 }
};

const shakeTransition = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

const CourseReviewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/learner/course/${courseId}`);
        setCourse(response.data.course || response.data); 
      } catch (err) {
        setError("System Link Failed. Course data unavailable.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#10b981', '#34d399', '#6ee7b7'];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (rating === 0 || reviewText.trim().length < 5) {
      setError(rating === 0 ? "Rating parameter missing." : "Log entry too short (min 5 chars).");
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
      setError(err.response?.data?.message || "Transmission failed.");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={50} />
        <p className="text-emerald-500/50 text-[10px] font-black mt-4 animate-pulse uppercase tracking-widest">Initialising Handshake...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-['Poppins'] selection:bg-emerald-500/30 flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Subtle background glow - adjusted for theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="max-w-6xl w-full mx-auto">
          
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
                <div className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] group-hover:border-emerald-500/50 transition-all shadow-sm">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Abort Mission</span>
            </button>
            
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </div>
          </motion.header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column */}
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden h-full">
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video relative shadow-inner border border-[var(--border-subtle)]">
                  {course?.thumbnail ? (
                    <img src={course.thumbnail} alt="Course" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--bg-input)] flex items-center justify-center">
                      <Lock className="text-[var(--text-muted)] opacity-20" />
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-black mb-2 leading-tight uppercase tracking-tighter">
                  {course?.title || "Unknown Protocol"}
                </h2>
                <p className="text-[var(--text-muted)] text-xs font-bold mb-6 border-l-2 border-emerald-500 pl-3 uppercase tracking-wide">
                  Instructor: <span className="text-[var(--text-main)]">{course?.instructor?.name || 'System Admin'}</span>
                </p>

                <div className="bg-[var(--bg-main)] rounded-xl p-5 border border-[var(--border-subtle)]">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <Sparkles size={14} /> Directive
                  </h3>
                  <ul className="space-y-2 text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-tight">
                    <li className="flex gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" /> Focus on skill acquisition.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" /> Critique the difficulty curve.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={itemVariants} className="lg:col-span-7">
              <motion.div 
                animate={shake ? shakeTransition : {}}
                className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative h-full flex flex-col justify-center"
              >
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <h3 className="font-black text-xl uppercase tracking-tighter text-[var(--text-main)]">Rate Experience</h3>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${hoverRating || rating ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                            {hoverRating === 1 && "Critical Failure"}
                            {hoverRating === 2 && "Sub-optimal"}
                            {hoverRating === 3 && "Acceptable"}
                            {hoverRating === 4 && "Superior"}
                            {hoverRating === 5 && "Legendary"}
                            {!hoverRating && rating === 0 && "Select Rating"}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-subtle)] justify-between max-w-md">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              variants={starVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none cursor-pointer p-1"
                            >
                              <Star 
                                size={36} 
                                className={`transition-all duration-300 ${
                                  star <= (hoverRating || rating) 
                                    ? "text-yellow-400 fill-yellow-400 drop-shadow-md" 
                                    : "text-[var(--text-muted)] opacity-20"
                                }`} 
                              />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-xl uppercase tracking-tighter text-[var(--text-main)] mb-4 flex items-center gap-2">
                          <MessageSquare className="text-emerald-500" size={20} /> Tactical Analysis
                        </h3>
                        <div className="relative">
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Data entry required. Describe your experience..."
                            className="w-full h-40 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-2xl p-6 text-sm text-[var(--text-main)] outline-none focus:border-emerald-500/50 transition-all resize-none placeholder:text-[var(--text-muted)] placeholder:opacity-50"
                          />
                          <div className="absolute bottom-4 right-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                             {reviewText.length} chars
                          </div>
                        </div>

                        <AnimatePresence>
                          {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-2 mt-4 text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/20"
                            >
                              <AlertCircle size={16} />
                              <span className="text-[10px] font-black uppercase">{error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.button 
                        disabled={isSubmitting}
                        className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all bg-emerald-500 text-white hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <>Submit Review <Send size={18} /></>}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center space-y-8 py-10"
                    >
                      <div className="w-28 h-28 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                        <CheckCircle size={56} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-[var(--text-main)] mb-2 uppercase tracking-tighter">Upload Complete</h2>
                        <p className="text-[var(--text-muted)] text-sm font-medium">Tactical analysis encrypted and stored in mainframe.</p>
                      </div>
                      <button onClick={() => navigate('/learner/my-courses')} className="px-8 py-4 rounded-full bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 transition-all cursor-pointer">
                        Return to Base
                      </button>
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