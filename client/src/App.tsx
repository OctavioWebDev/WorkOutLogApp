// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { StripeProvider } from './contexts/StripeContext'
import { useAuth } from './hooks/useAuth'

// Layout Components
import Layout from './components/Layout/Layout'
import PublicLayout from './components/Layout/PublicLayout'

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import PricingPage from './pages/PricingPage'

// Protected Pages
import DashboardPage from './pages/Dashboard/DashboardPage'
import WorkoutsPage from './pages/Workouts/WorkoutsPage'
import WorkoutDetailPage from './pages/Workouts/WorkoutDetailPage'
import CreateWorkoutPage from './pages/Workouts/CreateWorkoutPage'
import PersonalRecordsPage from './pages/PRs/PersonalRecordsPage'
import CompetitionsPage from './pages/Competitions/CompetitionsPage'
import CompetitionDetailPage from './pages/Competitions/CompetitionDetailPage'
import CreateCompetitionPage from './pages/Competitions/CreateCompetitionPage'
import GoalsPage from './pages/Goals/GoalsPage'
import CreateGoalsPage from './pages/Goals/CreateGoalsPage'
import ReviewPage from './pages/Goals/ReviewPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import SubscriptionPage from './pages/Subscription/SubscriptionPage'
import SubscriptionSuccessPage from './pages/Subscription/SubscriptionSuccessPage'
import SubscriptionCancelPage from './pages/Subscription/SubscriptionCancelPage'

// Error Pages
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './components/ErrorBoundary'

// Loading Component
import LoadingSpinner from './components/UI/LoadingSpinner'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StripeProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  
                  {/* Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <PublicLayout>
                          <LoginPage />
                        </PublicLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <PublicLayout>
                          <RegisterPage />
                        </PublicLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <PublicLayout>
                          <ForgotPasswordPage />
                        </PublicLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/reset-password/:token"
                    element={
                      <PublicRoute>
                        <PublicLayout>
                          <ResetPasswordPage />
                        </PublicLayout>
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <DashboardPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Workouts */}
                  <Route
                    path="/workouts"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <WorkoutsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/workouts/new"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CreateWorkoutPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/workouts/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <WorkoutDetailPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Personal Records */}
                  <Route
                    path="/records"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <PersonalRecordsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Competitions */}
                  <Route
                    path="/competitions"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CompetitionsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/competitions/new"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CreateCompetitionPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/competitions/:id"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CompetitionDetailPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Goals */}
                  <Route
                    path="/goals"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <GoalsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals/new"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CreateGoalsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals/review/:year"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ReviewPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Analytics */}
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <AnalyticsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Profile & Settings */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Subscription */}
                  <Route
                    path="/subscription"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <SubscriptionPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription/success"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <SubscriptionSuccessPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription/cancel"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <SubscriptionCancelPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

                {/* Global Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#22c55e',
                      },
                    },
                    error: {
                      style: {
                        background: '#ef4444',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </StripeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App