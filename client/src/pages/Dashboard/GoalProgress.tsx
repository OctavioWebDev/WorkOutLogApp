// src/components/Dashboard/GoalProgress.tsx
import React from 'react'
import { Link } from 'react-router-dom'

interface Goal {
  id: string
  lift: string
  target: number
  current: number
  deadline: string
}

interface GoalProgressProps {
  goals: Goal[]
  projections?: any
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goals, projections }) => {
  // Mock data if no goals provided
  const mockGoals = [
    {
      id: '1',
      lift: 'Squat',
      target: 350,
      current: 315,
      deadline: '2024-12-31'
    },
    {
      id: '2',
      lift: 'Bench Press',
      target: 275,
      current: 225,
      deadline: '2024-12-31'
    },
    {
      id: '3',
      lift: 'Deadlift',
      target: 450,
      current: 405,
      deadline: '2024-12-31'
    }
  ]

  const displayGoals = goals && goals.length > 0 ? goals : mockGoals

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 75) return 'bg-yellow-500'
    if (progress >= 50) return 'bg-blue-500'
    return 'bg-gray-400'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
        <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {displayGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target)
          
          return (
            <div key={goal.id}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">{goal.lift}</span>
                <span className="text-gray-600">{goal.target} lbs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Current: {goal.current} lbs</span>
                <span>{progress}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {displayGoals.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            🎯
          </div>
          <p className="text-gray-500 mb-2">No goals set</p>
          <Link 
            to="/goals" 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Set your first goal
          </Link>
        </div>
      )}
    </div>
  )
}

export default GoalProgress