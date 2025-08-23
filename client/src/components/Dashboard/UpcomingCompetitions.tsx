import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, TrophyIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
  daysUntilCompetition: number;
  registrationDeadline?: string;
  isRegistered: boolean;
}

interface UpcomingCompetitionsProps {
  competitions?: Competition[];
}

const UpcomingCompetitions: React.FC<UpcomingCompetitionsProps> = ({ competitions = [] }) => {
  // Mock data for demonstration
  const mockCompetitions: Competition[] = [
    {
      id: '1',
      name: 'State Powerlifting Championship',
      date: '2024-03-15',
      location: 'Los Angeles, CA',
      type: 'Powerlifting',
      daysUntilCompetition: 45,
      registrationDeadline: '2024-02-15',
      isRegistered: true
    },
    {
      id: '2',
      name: 'Spring Classic Meet',
      date: '2024-04-20',
      location: 'San Diego, CA',
      type: 'Powerlifting',
      daysUntilCompetition: 81,
      registrationDeadline: '2024-03-20',
      isRegistered: false
    }
  ];

  const displayCompetitions = competitions.length > 0 ? competitions : mockCompetitions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilText = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    return `${Math.floor(days / 30)} months`;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-100';
    if (days <= 30) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Competitions</h3>
        </div>
        <Link
          to="/competitions/new"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add
        </Link>
      </div>

      <div className="space-y-4">
        {displayCompetitions.slice(0, 3).map((competition) => (
          <div key={competition.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{competition.name}</h4>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(competition.date)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {competition.location}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(competition.daysUntilCompetition)}`}>
                  {getDaysUntilText(competition.daysUntilCompetition)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">Type:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {competition.type}
                </span>
                {competition.isRegistered && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                    Registered
                  </span>
                )}
              </div>
              
              {!competition.isRegistered && competition.registrationDeadline && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Registration closes: {formatDate(competition.registrationDeadline)}
                  </p>
                </div>
              )}
            </div>

            {!competition.isRegistered && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Register for Competition
                </button>
              </div>
            )}
          </div>
        ))}

        {displayCompetitions.length === 0 && (
          <div className="text-center py-8">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No upcoming competitions</p>
            <p className="text-sm text-gray-400 mb-4">Plan your next meet to stay motivated!</p>
            <Link
              to="/competitions/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Plan Competition
            </Link>
          </div>
        )}
      </div>

      {displayCompetitions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to="/competitions"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all competitions →
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingCompetitions;
