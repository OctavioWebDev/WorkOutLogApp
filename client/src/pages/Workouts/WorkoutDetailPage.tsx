import React from 'react'

const WorkoutDetailPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Workout Details</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and edit your workout details
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Workout Information
        </h2>
        <p className="text-gray-600">
          Workout details will be displayed here.
        </p>
      </div>
    </div>
  )
}

export default WorkoutDetailPage
