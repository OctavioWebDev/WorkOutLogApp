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
import { AuthProvider } from './contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing page has its own navigation built-in */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth pages typically don't need navigation */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* App pages with navigation */}
            <Route 
              path="/dashboard" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <DashboardPage />
                </div>
              } 
            />
            <Route 
              path="/workouts" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <WorkoutsPage />
                </div>
              } 
            />
            <Route 
              path="/prs" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <PersonalRecordsPage />
                </div>
              } 
            />
            <Route 
              path="/competitions" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <CompetitionsPage />
                </div>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <AnalyticsPage />
                </div>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <GoalsPage />
                </div>
              } 
            />
            <Route 
              path="/programs" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <ProgramsPage />
                </div>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <div className="min-h-screen bg-gray-100">
                  <Navigation />
                  <ProfilePage />
                </div>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
