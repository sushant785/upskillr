import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, Mail, BarChart, Trophy, BookOpen, Calendar, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api.js';
import { useToast } from "../../context/ToastContext.jsx";

const Enrollments = () => {

    const [learners, setLearners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'enrolledAt', direction: 'desc' });
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const toast = useToast();
    
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/instructor/enrollments');
                setLearners(data.learners);
            }
            catch(err) {
                console.error("Failed", err);
                toast.error("Failed to load student enrollments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllStudents();
    }, []);


    if (loading) {
        return (
            <div className='flex min-h-screen w-full items-center justify-center bg-[var(--bg-main)] text-emerald-500 relative overflow-hidden'>
                 {/* Loading Background Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent animate-pulse" />
                <Loader2 className='animate-spin relative z-10' size={40}/>
            </div>
        );
    }

    const processedLearners = learners
        .filter(student => {
            const matchesSearch = 
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                student.email.toLowerCase().includes(searchTerm.toLowerCase());
                
            // 2. Check Course Filter
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
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = processedLearners.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedLearners.length / itemsPerPage);

  return (
    <div className="font-['Poppins'] text-[var(--text-main)] bg-[var(--bg-main)] min-h-screen transition-colors duration-300 relative overflow-hidden">
      
      {/* --- AMBIENT BACKGROUNDS --- */}
      <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* --- CONTENT WRAPPER (z-10) --- */}
      <div className="relative z-10 p-6 md:p-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">My Students</h1>
            <p className="text-[var(--text-muted)]">Track progress and engagement across all your courses.</p>
            </div>
            
            {/* Total Students Card */}
            <div className="flex items-center gap-4 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
                <div className="p-3 bg-emerald-500 rounded-full text-emerald-950 shadow-lg shadow-emerald-500/20">
                    <Trophy size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-[var(--text-main)] leading-none">{learners.length}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mt-1">Active Learners</p>
                </div>
            </div>
        </div>

        {/* --- EMPTY STATE --- */}
        {learners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl text-center shadow-sm backdrop-blur-sm">
                <div className="p-5 bg-[var(--bg-input)] rounded-full mb-6 border border-[var(--border-subtle)]">
                    <User size={40} className="text-[var(--text-muted)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">No Students Yet</h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto">
                    Once students enroll in your courses, they will appear here.
                </p>
            </div>
        ) : (

            <div className="flex flex-col gap-4 mb-6"> 

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-sm backdrop-blur-sm">
                    {/* Left: Title or Filter Label */}
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)] text-sm hidden sm:inline">Filter:</span>
                        <select 
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="bg-[var(--bg-input)] text-[var(--text-main)] text-sm border border-[var(--border-subtle)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer hover:brightness-110 transition-all"
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                        <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-[var(--text-muted)]"
                        />
                    </div>
                </div>
            
                {/* --- MAIN TABLE ---  */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    
                    {/* Table Head */}
                    <thead>
                        <tr className="border-b border-[var(--border-subtle)] text-xs font-black uppercase text-[var(--text-muted)] bg-[var(--bg-input)]">
                            <th className="p-5 min-w-[250px]">Student Name</th>
                            <th className="p-5 min-w-[200px]">Enrolled Course</th>
                            <th 
                            className="p-5 min-w-[200px] cursor-pointer hover:text-emerald-500 transition-colors group select-none"
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
                            className="p-5 cursor-pointer hover:text-emerald-500 transition-colors group select-none"
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
                                className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-input)] transition-colors group"
                            >
                                
                                {/* 1. Name & Email */}
                                <td className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center text-sm font-bold text-[var(--text-main)]">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[var(--text-main)] text-sm group-hover:text-emerald-500 transition-colors">
                                            {student.name}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
                                            <Mail size={12} /> {student.email}
                                        </div>
                                    </div>
                                </div>
                                </td>

                                {/* 2. Course Title */}
                                <td className="p-5">
                                <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
                                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-500">
                                        <BookOpen size={14} />
                                    </div>
                                    <span className="truncate max-w-[180px] text-[var(--text-main)]" title={student.courseName}>
                                        {student.courseName}
                                    </span>
                                </div>
                                </td>

                                {/* 3. The "Great" Progress Bar (Complex UI) */}
                                <td className="p-5">
                                    <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                        {/* Top Row: Percent & Lesson Count */}
                                        <div className="flex justify-between items-end">
                                            <span className={`text-sm font-bold ${student.progressPercent === 100 ? 'text-emerald-500' : 'text-[var(--text-main)]'}`}>
                                                {student.progressPercent}%
                                            </span>
                                            <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wide">
                                                {student.completedLessons} / {student.totalLessons} Lessons
                                            </span>
                                        </div>

                                        {/* Bottom Row: Visual Bar */}
                                        <div className="h-1.5 w-full bg-[var(--bg-input)] rounded-full overflow-hidden">
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
                                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
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
                    <div className="flex items-center justify-between p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]">
                        
                        {/* Text Info */}
                        <div className="text-xs text-[var(--text-muted)]">
                            Showing <span className="text-[var(--text-main)] font-bold">{indexOfFirstItem + 1}</span> to <span className="text-[var(--text-main)] font-bold">{Math.min(indexOfLastItem, processedLearners.length)}</span> of <span className="text-[var(--text-main)] font-bold">{processedLearners.length}</span> students
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-input)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-main)]"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            <span className="text-xs font-medium text-[var(--text-muted)]">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-input)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-main)]"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default Enrollments;