import React, { useState } from 'react'
import ProgramsPage from './pages/Programs/ProgramsPage'
import GoalsPage from './pages/Goals/GoalsPage'
import WorkoutsPage from './pages/Workouts/WorkoutsPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import CompetitionsPage from './pages/Competitions/CompetitionsPage'
import PersonalRecordsPage from './pages/PRs/PersonalRecordsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

function App() {
  
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Main Content */}
      {<LandingPage />}
      {<DashboardPage />}
      {<WorkoutsPage />}
      {<PersonalRecordsPage />}
      {<CompetitionsPage />}
      {<AnalyticsPage />}
      {<GoalsPage />}
      {<ProgramsPage />}
      {<ProfilePage />}
      {<ProgramsPage />}
      {<ProfilePage />}
      {<LoginPage />}
      {<RegisterPage />}
    </div>
  )
}

export default App
