import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navigation = () => {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    window.location.href = '/' // Use window.location for consistency with login
  }

  return (
    <nav className="bg-white shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center">
        {/* Main Navigation Links */}
        <div className="flex gap-4 flex-wrap">
          <Link to="/dashboard" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/workouts" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            Workouts
          </Link>
          <Link to="/prs" className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
            PRs
          </Link>
          <Link to="/competitions" className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Competitions
          </Link>
          <Link to="/analytics" className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
            Analytics
          </Link>
          <Link to="/goals" className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors">
            Goals
          </Link>
          <Link to="/programs" className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
            Programs
          </Link>
        </div>

        {/* User Profile Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* User Avatar */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=32&background=3b82f6&color=fff`}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              {/* User Name */}
              <span className="text-gray-700 font-medium hidden sm:block">
                {user.name}
              </span>
              {/* Dropdown Arrow */}
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsProfileOpen(false)}
                />
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                        user.subscriptionStatus === 'trial' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.subscriptionStatus}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.profileComplete}% complete
                      </span>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </Link>

                    {user.subscriptionStatus === 'trial' && (
                      <Link
                        to="/subscription"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Upgrade Plan
                      </Link>
                    )}

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* If no user, show login/register links */
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation