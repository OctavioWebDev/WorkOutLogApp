import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
  notes?: string;
}

interface RecentWorkoutsProps {
  workouts?: Workout[];
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ workouts = [] }) => {
  // Mock data for demonstration
  const mockWorkouts: Workout[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Strength Training',
      duration: 90,
      exercises: [
        { name: 'Squat', sets: 3, reps: 5, weight: 315 },
        { name: 'Bench Press', sets: 3, reps: 5, weight: 225 },
        { name: 'Deadlift', sets: 1, reps: 5, weight: 405 }
      ],
      notes: 'Felt strong today, hit all planned weights'
    },
    {
      id: '2',
      date: '2024-01-13',
      type: 'Accessory Work',
      duration: 60,
      exercises: [
        { name: 'Romanian Deadlift', sets: 4, reps: 8, weight: 185 },
        { name: 'Overhead Press', sets: 4, reps: 6, weight: 135 },
        { name: 'Barbell Rows', sets: 4, reps: 8, weight: 155 }
      ]
    },
    {
      id: '3',
      date: '2024-01-11',
      type: 'Strength Training',
      duration: 85,
      exercises: [
        { name: 'Squat', sets: 3, reps: 3, weight: 325 },
        { name: 'Bench Press', sets: 3, reps: 3, weight: 235 },
        { name: 'Deadlift', sets: 1, reps: 3, weight: 415 }
      ],
      notes: 'New PR on deadlift!'
    }
  ];

  const displayWorkouts = workouts.length > 0 ? workouts : mockWorkouts;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        <Link 
          to="/workouts" 
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {displayWorkouts.slice(0, 3).map((workout) => (
          <div key={workout.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                <h4 className="font-medium text-gray-900">{workout.type}</h4>
              </div>
              <span className="text-sm text-gray-500">{formatDate(workout.date)}</span>
            </div>
            
            <div className="ml-5">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <ClockIcon className="h-4 w-4 mr-1" />
                {workout.duration} minutes
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {exercise.name}: {exercise.sets}×{exercise.reps} @ {exercise.weight}lbs
                  </span>
                ))}
                {workout.exercises.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{workout.exercises.length - 3} more
                  </span>
                )}
              </div>
              
              {workout.notes && (
                <p className="text-sm text-gray-600 italic">"{workout.notes}"</p>
              )}
            </div>
          </div>
        ))}

        {displayWorkouts.length === 0 && (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent workouts</p>
            <p className="text-sm text-gray-400 mb-4">Start logging your training sessions!</p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Log Your First Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentWorkouts;
