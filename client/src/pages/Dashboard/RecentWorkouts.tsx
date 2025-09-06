// src/components/Dashboard/RecentWorkouts.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const RecentWorkouts: React.FC = () => {
  // Mock data for now
  const recentWorkouts = [
    {
      id: '1',
      name: 'Upper Body Strength',
      date: '2024-09-05',
      duration: 90,
      highlights: 'Bench: 225x5, OHP: 155x5'
    },
    {
      id: '2', 
      name: 'Squat Focus',
      date: '2024-09-03',
      duration: 75,
      highlights: 'Squat: 315x3 (PR!)'
    },
    {
      id: '3',
      name: 'Deadlift Day', 
      date: '2024-09-01',
      duration: 80,
      highlights: 'Deadlift: 405x1'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        <Link to="/workouts" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {recentWorkouts.map((workout, index) => (
          <div key={workout.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">{workout.name}</p>
              <span className="text-xs text-gray-500">{workout.duration} min</span>
            </div>
            <p className="text-sm text-gray-600">{workout.date}</p>
            <p className="text-sm text-gray-500">{workout.highlights}</p>
          </div>
        ))}
      </div>

      {recentWorkouts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent workouts</p>
          <p className="text-sm text-gray-400">Start logging workouts to see them here!</p>
        </div>
      )}
    </div>
  )
}

export default RecentWorkouts