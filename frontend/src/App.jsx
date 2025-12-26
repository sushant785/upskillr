import { useState } from 'react'
import './App.css'
import Login  from './pages/Login.jsx'
import LearnerDashboard from './pages/Dashboard/LearnerDashboard.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.jsx';
import Sidebar from './components/Sidebar.jsx';
import Profile from './pages/Profile.jsx';

function App() {


  return (
    <>
      
      <Router>
        <Routes>
          {/* Auth routes (No Sidebar) */}
          <Route path="/" element={<Login />} />
          
          <Route element={<DashboardLayout />}>
          <Route path="/learner-dashboard" element={<LearnerDashboard />} />
          <Route path="profile" element={<Profile />} />
          
        </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
