import React, {useState,useEffect} from 'react';
import {Search,Loader2,User,Mail,BarChart,Trophy,BookOpen,Calendar,ArrowUpDown,ArrowUp,ArrowDown,ChevronLeft,ChevronRight} from 'lucide-react';
import api from '../../utils/api.js'

const Enrollments = () => {

    const [learners,setLearners] = useState([])
    const [loading,setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'enrolledAt', direction: 'desc' });
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [currentPage,setCurrentPage] = useState(1);
    
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                setLoading(true)
                const {data} = await api.get('/instructor/enrollments')
                setLearners(data.learners)
            }
            catch(err) {
                console.error("Failed",err)
            } finally {
                setLoading(false);
            }
        };

        fetchAllStudents();
    }, [])


    if(loading) {
        return (
            <div className='flex h-[50vh] w-full items-center justify-center text-emerald-500'>
                <Loader2 className='animate-spin' size={40}/>
            </div>
        )
    }

    const processedLearners = learners
        .filter(student => {
            const matchesSearch = 
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                student.email.toLowerCase().includes(searchTerm.toLowerCase());
                
                // 2. Check Course Filter (NEW)
                const matchesCourse = selectedCourse === "all" || student.courseName === selectedCourse;

                return matchesSearch && matchesCourse;

        })
        .sort((a, b) => {
            // If values are equal, do nothing
            if (a[sortConfig.key] === b[sortConfig.key]) return 0;
            
            // Check if Ascending or Descending
            if (sortConfig.direction === 'asc') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            } else {
                return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
            }
    });

    const handleSort = (key) => {
        let direction = 'asc';
        // If clicking the same header again, flip direction
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get unique course titles for the dropdown
    const uniqueCourses = ["all", ...new Set(learners.map(student => student.courseName))];

    //pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = processedLearners.slice(indexOfFirstItem,indexOfLastItem)
    const totalPages = Math.ceil(processedLearners.length/itemsPerPage)

  return (
    <div className="p-6 md:p-10 font-['Poppins'] text-white min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">My Students</h1>
          <p className="text-slate-400">Track progress and engagement across all your courses.</p>
        </div>
        
        {/* Total Students Card */}
        <div className="flex items-center gap-4 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <div className="p-3 bg-emerald-500 rounded-full text-emerald-950 shadow-lg shadow-emerald-500/20">
                <Trophy size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white leading-none">{learners.length}</h3>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mt-1">Active Learners</p>
            </div>
        </div>
      </div>

      {/* --- EMPTY STATE --- */}
      {learners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl text-center">
            <div className="p-5 bg-white/5 rounded-full mb-6 border border-white/10">
                <User size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Students Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
                Once students enroll in your courses, they will appear here.
            </p>
        </div>
      ) : (

        <div className="flex flex-col gap-4 mb-6"> {/* Wrapped in a div for spacing */}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0f172a] p-4 rounded-xl border border-white/10">
                {/* Left: Title or Filter Label */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm hidden sm:inline">Filter:</span>
                    <select 
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-[#1e293b] text-white text-sm border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                        <option value="all">All Courses</option>
                        {uniqueCourses.map(course => (
                            course !== 'all' && (
                            <option key={course} value={course}>{course}</option>
                            )
                        ))}
                    </select>
                </div>

                {/* Right: Search Input */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1e293b] border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
            </div>
        
             {/* --- MAIN TABLE ---  */}
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                
            {/* Table Head */}
            <thead>
                <tr className="border-b border-white/10 text-xs font-black uppercase text-slate-500 bg-white/[0.02]">
                    <th className="p-5 min-w-[250px]">Student Name</th>
                    <th className="p-5 min-w-[200px]">Enrolled Course</th>
                    <th 
                    className="p-5 min-w-[200px] cursor-pointer hover:text-emerald-400 transition-colors group select-none"
                    onClick={() => handleSort('progressPercent')}
                    >
                    <div className="flex items-center gap-2">
                        Progress
                        {sortConfig.key === 'progressPercent' ? 
                        (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) 
                        :(<ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />)}
                    </div>
                    </th>

                    {/* DATE (Clickable) */}
                    <th 
                    className="p-5 cursor-pointer hover:text-emerald-400 transition-colors group select-none"
                    onClick={() => handleSort('enrolledAt')}
                    >
                    <div className="flex items-center gap-2">
                        Enrolled Date
                        {sortConfig.key === 'enrolledAt' ? 
                        (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)
                        :(<ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />)}
                    </div>
                    </th>

                </tr>
            </thead>
                
                {/* Table Body */}
                <tbody>
                    {currentItems.map((student) => (
                    <tr 
                        key={student._id} 
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group"
                    >
                        
                        {/* 1. Name & Email */}
                        <td className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                                    {student.name}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                    <Mail size={12} /> {student.email}
                                </div>
                            </div>
                        </div>
                        </td>

                        {/* 2. Course Title */}
                        <td className="p-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                                <BookOpen size={14} />
                            </div>
                            <span className="truncate max-w-[180px]" title={student.courseName}>
                                {student.courseName}
                            </span>
                        </div>
                        </td>

                        {/* 3. The "Great" Progress Bar (Complex UI) */}
                        <td className="p-5">
                            <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                {/* Top Row: Percent & Lesson Count */}
                                <div className="flex justify-between items-end">
                                    <span className={`text-sm font-bold ${student.progressPercent === 100 ? 'text-emerald-400' : 'text-white'}`}>
                                        {student.progressPercent}%
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                                        {student.completedLessons} / {student.totalLessons} Lessons
                                    </span>
                                </div>

                                {/* Bottom Row: Visual Bar */}
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            student.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                                        }`}
                                        style={{ width: `${student.progressPercent}%` }} 
                                    />
                                </div>
                            </div>
                        </td>

                        {/* 4. Date */}
                        <td className="p-5">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <Calendar size={14} />
                            {new Date(student.enrolledAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                        </td>

                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/[0.02]">
                
                {/* Text Info */}
                <div className="text-xs text-slate-500">
                    Showing <span className="text-white font-bold">{indexOfFirstItem + 1}</span> to <span className="text-white font-bold">{Math.min(indexOfLastItem, processedLearners.length)}</span> of <span className="text-white font-bold">{processedLearners.length}</span> students
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-xs font-medium text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Enrollments
