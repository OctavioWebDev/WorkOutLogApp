import React from 'react'

const CompetitionDetailPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Competition Details</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage your competition information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Competition Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Competition Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">Competition Name</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <p className="mt-1 text-sm text-gray-900">TBD</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Federation</label>
              <p className="mt-1 text-sm text-gray-900">TBD</p>
            </div>
          </div>
        </div>

        {/* Planned Attempts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Planned Attempts
          </h2>
          <p className="text-gray-600">
            Attempt selection will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CompetitionDetailPage
