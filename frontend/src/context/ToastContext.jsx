import { createContext,useContext,useState,useCallback } from "react";
import { AnimatePresence,motion } from 'framer-motion';
import { X,CheckCircle,AlertCircle,Info,AlertTriangle } from 'lucide-react';


const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext)
    if(!context)
    {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export const ToastProvider = ({children}) => {

    const [toasts,setToast] = useState([]);

    const removeToast = useCallback((id)=>{
        setToast((prev) => prev.filter((toast) => toast.id !==id))
    },[])

    const addToast = useCallback((message,type="info",duration=4000) => {
        const id = Date.now();
        setToast((prev) => [...prev,{id,message,type}]);

        if(duration) {
            setTimeout(() => {removeToast(id);},duration);
        }
    },[removeToast])

    const toastValues = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
        warning: (msg) => addToast(msg, 'warning'),
    };

    return (
    <ToastContext.Provider value={toastValues}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const toastStyles = {
  success: { 
    icon: CheckCircle, 
    // Dark glass background with subtle green tint
    bg: 'bg-gradient-to-r from-emerald-500/10 to-transparent bg-black/80', 
    // Glowing green border
    border: 'border border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]', 
    text: 'text-emerald-500',
    progress: 'bg-emerald-500'
  },
  error: { 
    icon: AlertCircle, 
    bg: 'bg-gradient-to-r from-red-500/10 to-transparent bg-black/80', 
    border: 'border border-red-500/30 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]', 
    text: 'text-red-500',
    progress: 'bg-red-500'
  },
  warning: { 
    icon: AlertTriangle, 
    bg: 'bg-gradient-to-r from-orange-500/10 to-transparent bg-black/80', 
    border: 'border border-orange-500/30 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)]', 
    text: 'text-orange-500',
    progress: 'bg-orange-500'
  },
  info: { 
    icon: Info, 
    bg: 'bg-gradient-to-r from-blue-500/10 to-transparent bg-black/80', 
    border: 'border border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]', 
    text: 'text-blue-500',
    progress: 'bg-blue-500'
  },
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const style = toastStyles[t.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              // Bouncy spring animation
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                relative overflow-hidden pointer-events-auto w-[350px] 
                rounded-2xl backdrop-blur-xl p-4 flex items-start gap-4 
                ${style.bg} ${style.border}
              `}
            >
              {/* Icon Bubble */}
              <div className={`
                shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
                bg-white/5 border border-white/10 shadow-inner
                ${style.text}
              `}>
                <Icon size={20} />
              </div>

              {/* Text Content */}
              <div className="flex-1 pt-0.5">
                <p className={`text-sm font-black uppercase tracking-wider mb-1 ${style.text}`}>
                  {t.type}
                </p>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {t.message}
                </p>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => removeToast(t.id)} 
                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={16} />
              </button>

              {/* 🟢 NEW: Progress Bar Animation */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }} // Matches the 4000ms duration
                className={`absolute bottom-0 left-0 h-1 ${style.progress} opacity-30`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};


