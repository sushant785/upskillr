import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useAuth } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import LearnerDashboard from './pages/Dashboard/LearnerDashboard.jsx';
import Profile from './pages/Profile.jsx';
import MyCourses from './pages/Dashboard/MyCourses.jsx'; //
import BrowseCourses from './pages/Dashboard/BrowseCourses.jsx'; //
import CreateCourse from './pages/Instructor/CreateCourse.jsx';
import CourseBuilder from './pages/Instructor/CourseBuilder.jsx';
import CoursePlayer from './pages/Dashboard/CoursePlayer.jsx'; //
import CourseReview from './pages/Dashboard/CourseReview.jsx'; 
import CourseDetail from './pages/Dashboard/CourseDetail.jsx'; 

import LearnerLayout from './components/LearnerLayout.jsx';
import InstructorLayout from './components/InstructorLayout.jsx';
import InstructorDashboard from './pages/Instructor/InstructorDashboard.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstructorCourses from './pages/Instructor/InstructorCourses.jsx';
import Progress from './pages/Progress.jsx';
import Enrollments from './pages/Instructor/Enrollments.jsx';


function App() {

  const { setAuth } = useAuth(); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const verifySession = async () => {
      try {
        
        const response = await axios.get("http://localhost:5000/api/auth/refresh", {
          withCredentials: true 
        });

        
        setAuth({
          user: response.data.user,
          accessToken: response.data.accessToken,
          role: response.data.user.role 
        });

        console.log("Session restored for:", response.data.user.email);

      } catch (err) {
        console.log("No active session");
        
        setAuth({ user: null, accessToken: null, role: null });
      } finally {
        
        setIsLoading(false);
      }
    };

    verifySession();
  }, []); 

  // 4. Show Loading Screen while checking
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }


  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Login />} />

       
        <Route element={<ProtectedRoute allowedRoles={['learner']} />}>

        <Route path="/learner/course/:courseId/learn" element={<CoursePlayer />} />
        <Route path="/learner/course/:courseId" element={<CourseDetail />} />

          <Route element={<LearnerLayout />}>
            <Route path="/learner/dashboard" element={<LearnerDashboard />} />
            <Route path="/learner/browse" element={<BrowseCourses />} /> 
            <Route path="/learner/my-courses" element={<MyCourses />} /> 
            <Route path="/learner/profile" element={<Profile />} />
            <Route path="/learner/progress" element={<Progress />} />
            <Route path="/learner/course/:courseId/review" element={<CourseReview />} />
            
          </Route>
        </Route>

        
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route element={<InstructorLayout />}>
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/create-course" element={<CreateCourse />} />
            <Route path="/instructor/course/:courseId/manage" element={<CourseBuilder />} />
            <Route path="/instructor/courses" element={<InstructorCourses />} />
            <Route path="/instructor/enrollments" element={<Enrollments />}/>
            <Route path="/instructor/profile" element={<Profile />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
