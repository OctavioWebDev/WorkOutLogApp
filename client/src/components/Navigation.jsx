import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm p-4 mb-4">
      <div className="flex gap-4 flex-wrap">
        <Link to="/" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Landing
        </Link>
        <Link to="/dashboard" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Dashboard
        </Link>
        <Link to="/workouts" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Workouts
        </Link>
        <Link to="/prs" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          PRs
        </Link>
        <Link to="/competitions" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Competitions
        </Link>
        <Link to="/analytics" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Analytics
        </Link>
        <Link to="/goals" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Goals
        </Link>
        <Link to="/programs" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Programs
        </Link>
        <Link to="/profile" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Profile
        </Link>
        <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Login
        </Link>
        <Link to="/register" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Register
        </Link>
      </div>
    </nav>
  )
}

export default Navigation