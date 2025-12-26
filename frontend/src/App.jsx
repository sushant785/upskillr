import Login from './pages/Login.jsx';
import LearnerDashboard from './pages/Dashboard/LearnerDashboard.jsx';
import Profile from './pages/Profile.jsx';

import LearnerLayout from './components/LearnerLayout.jsx';
import InstructorLayout from './components/InstructorLayout.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Login />} />

       
        <Route element={<ProtectedRoute allowedRoles={['learner']} />}>
          <Route element={<LearnerLayout />}>
            <Route path="/learner/dashboard" element={<LearnerDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route element={<InstructorLayout />}>
            <Route path="/instructor/dashboard" element={<LearnerDashboard />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
