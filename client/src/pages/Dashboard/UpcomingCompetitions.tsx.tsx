// src/components/Dashboard/UpcomingCompetitions.tsx
import React from 'react'
import { Link } from 'react-router-dom'

interface Competition {
  id: string
  name: string
  date: string
  daysUntilCompetition: number
  location: string
  federation: string
}

interface UpcomingCompetitionsProps {
  competitions: Competition[]
}

const UpcomingCompetitions: React.FC<UpcomingCompetitionsProps> = ({ competitions }) => {
  // Mock data if no competitions provided
  const mockCompetitions = [
    {
      id: '1',
      name: 'State Championships',
      date: '2024-11-15',
      daysUntilCompetition: 45,
      location: 'Toledo, OH',
      federation: 'USPA'
    },
    {
      id: '2',
      name: 'Winter Open',
      date: '2024-12-20',
      daysUntilCompetition: 80,
      location: 'Columbus, OH', 
      federation: 'USAPL'
    }
  ]

  const displayCompetitions = competitions.length > 0 ? competitions : mockCompetitions

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Competitions</h3>
        <Link to="/competitions" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {displayCompetitions.slice(0, 3).map((competition) => (
          <div key={competition.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{competition.name}</h4>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {competition.daysUntilCompetition} days
              </span>
            </div>
            <p className="text-sm text-gray-600">{competition.location}</p>
            <p className="text-xs text-gray-500">{competition.federation}</p>
            <p className="text-xs text-gray-400 mt-1">{competition.date}</p>
          </div>
        ))}
      </div>

      {displayCompetitions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            🏆
          </div>
          <p className="text-gray-500 mb-2">No upcoming competitions</p>
          <Link 
            to="/competitions/new" 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Plan your next meet
          </Link>
        </div>
      )}
    </div>
  )
}

export default UpcomingCompetitions