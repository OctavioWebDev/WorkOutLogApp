// src/components/Dashboard/SubscriptionStatus.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const SubscriptionStatus: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            ⚠️
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Trial ending soon
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Your free trial expires in 3 days. Subscribe to continue using all features.
          </p>
        </div>
        <div className="ml-4">
          <Link
            to="/subscription"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionStatus