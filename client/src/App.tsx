import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'

// Import pages with correct paths based on your actual file structure
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import WorkoutsPage from './pages/Workouts/WorkoutsPage'
import PersonalRecordsPage from './pages/PRs/PersonalRecordsPage'
import CompetitionsPage from './pages/Competitions/CompetitionsPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import GoalsPage from './pages/Goals/GoalsPage'
import ProgramsPage from './pages/Programs/ProgramsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Landing page has its own navigation */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Other pages use the main navigation */}
          <Route path="/dashboard" element={<><Navigation /><DashboardPage /></>} />
          <Route path="/workouts" element={<><Navigation /><WorkoutsPage /></>} />
          <Route path="/prs" element={<><Navigation /><PersonalRecordsPage /></>} />
          <Route path="/competitions" element={<><Navigation /><CompetitionsPage /></>} />
          <Route path="/analytics" element={<><Navigation /><AnalyticsPage /></>} />
          <Route path="/goals" element={<><Navigation /><GoalsPage /></>} />
          <Route path="/programs" element={<><Navigation /><ProgramsPage /></>} />
          <Route path="/profile" element={<><Navigation /><ProfilePage /></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
