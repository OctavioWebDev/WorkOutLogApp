// src/components/Dashboard/PRProgress.tsx
import React from 'react'

const PRProgress: React.FC = () => {
  // Mock chart data
  const mockData = [
    { month: 'Jan', squat: 285, bench: 205, deadlift: 365 },
    { month: 'Feb', squat: 295, bench: 210, deadlift: 375 },
    { month: 'Mar', squat: 305, bench: 215, deadlift: 385 },
    { month: 'Apr', squat: 315, bench: 225, deadlift: 405 }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">PR Progress</h3>
      
      {/* Simple chart representation */}
      <div className="space-y-4">
        {mockData.map((data, index) => (
          <div key={data.month} className="flex items-center space-x-4">
            <div className="w-12 text-sm text-gray-600">{data.month}</div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-500">Squat</div>
                <div className="text-sm font-medium">{data.squat}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Bench</div>
                <div className="text-sm font-medium">{data.bench}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Deadlift</div>
                <div className="text-sm font-medium">{data.deadlift}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">315</div>
            <div className="text-xs text-gray-500">Current Squat</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">225</div>
            <div className="text-xs text-gray-500">Current Bench</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">405</div>
            <div className="text-xs text-gray-500">Current Deadlift</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PRProgress