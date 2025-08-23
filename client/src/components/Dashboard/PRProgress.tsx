import React from 'react';
import { ArrowTrendingUpIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface PRData {
  lift: string;
  currentPR: number;
  previousPR: number;
  date: string;
  improvement: number;
}

interface PRProgressProps {
  prData?: PRData[];
}

const PRProgress: React.FC<PRProgressProps> = ({ prData = [] }) => {
  // Mock data for demonstration
  const mockPRData: PRData[] = [
    {
      lift: 'Squat',
      currentPR: 315,
      previousPR: 305,
      date: '2024-01-15',
      improvement: 10
    },
    {
      lift: 'Bench Press',
      currentPR: 225,
      previousPR: 220,
      date: '2024-01-12',
      improvement: 5
    },
    {
      lift: 'Deadlift',
      currentPR: 405,
      previousPR: 395,
      date: '2024-01-11',
      improvement: 10
    },
    {
      lift: 'Overhead Press',
      currentPR: 135,
      previousPR: 130,
      date: '2024-01-08',
      improvement: 5
    }
  ];

  const displayData = prData.length > 0 ? prData : mockPRData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getProgressPercentage = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Records Progress</h3>
        </div>
        <span className="text-sm text-gray-500">Last 30 days</span>
      </div>

      <div className="space-y-4">
        {displayData.map((pr, index) => (
          <div key={pr.lift} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <ArrowTrendingUpIcon className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{pr.lift}</h4>
                <p className="text-sm text-gray-500">
                  {formatDate(pr.date)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 mr-2">
                  {pr.currentPR} lbs
                </span>
                <div className="flex items-center text-green-600">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    +{pr.improvement} lbs
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                +{getProgressPercentage(pr.currentPR, pr.previousPR)}% improvement
              </p>
            </div>
          </div>
        ))}

        {displayData.length === 0 && (
          <div className="text-center py-8">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent PRs</p>
            <p className="text-sm text-gray-400">Keep training to set new personal records!</p>
          </div>
        )}
      </div>

      {displayData.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center">
            <TrophyIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Great progress! You've improved across {displayData.length} lifts this month.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRProgress;
