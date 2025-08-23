import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { FlagIcon as TargetIcon } from '@heroicons/react/24/outline';

interface Goal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}

interface Projection {
  goalId: string;
  projectedCompletion: string;
  onTrack: boolean;
  progressRate: number;
}

interface GoalProgressProps {
  goals?: Goal[];
  projections?: Projection[];
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goals = [], projections = [] }) => {
  // Mock data for demonstration
  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Squat 350 lbs',
      targetValue: 350,
      currentValue: 315,
      unit: 'lbs',
      deadline: '2024-06-01',
      priority: 'high',
      isActive: true
    },
    {
      id: '2',
      title: 'Bench 250 lbs',
      targetValue: 250,
      currentValue: 225,
      unit: 'lbs',
      deadline: '2024-05-15',
      priority: 'high',
      isActive: true
    },
    {
      id: '3',
      title: 'Deadlift 450 lbs',
      targetValue: 450,
      currentValue: 405,
      unit: 'lbs',
      deadline: '2024-07-01',
      priority: 'medium',
      isActive: true
    }
  ];

  const mockProjections: Projection[] = [
    {
      goalId: '1',
      projectedCompletion: '2024-05-20',
      onTrack: true,
      progressRate: 2.5
    },
    {
      goalId: '2',
      projectedCompletion: '2024-06-10',
      onTrack: false,
      progressRate: 1.8
    },
    {
      goalId: '3',
      projectedCompletion: '2024-06-15',
      onTrack: true,
      progressRate: 3.2
    }
  ];

  const displayGoals = goals.length > 0 ? goals : mockGoals;
  const displayProjections = projections.length > 0 ? projections : mockProjections;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProjectionForGoal = (goalId: string) => {
    return displayProjections.find(p => p.goalId === goalId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TargetIcon className="h-6 w-6 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
        </div>
        <Link 
          to="/goals" 
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {displayGoals.slice(0, 3).map((goal) => {
          const progressPercentage = getProgressPercentage(goal.currentValue, goal.targetValue);
          const projection = getProjectionForGoal(goal.id);
          const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
          const isCompleted = progressPercentage >= 100;

          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    {isCompleted && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    <h4 className={`font-medium ${isCompleted ? 'text-green-900' : 'text-gray-900'}`}>
                      {goal.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{progressPercentage.toFixed(0)}% complete</span>
                  <span className="text-gray-500">
                    Due {formatDate(goal.deadline)} ({daysUntilDeadline} days)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 
                      progressPercentage >= 75 ? 'bg-blue-500' :
                      progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Projection Info */}
              {projection && !isCompleted && (
                <div className={`text-xs p-2 rounded ${
                  projection.onTrack ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {projection.onTrack ? '✓' : '⚠'} Projected completion: {formatDate(projection.projectedCompletion)}
                  {!projection.onTrack && ' (behind schedule)'}
                </div>
              )}

              {isCompleted && (
                <div className="text-xs p-2 rounded bg-green-50 text-green-700">
                  🎉 Goal completed! Great work!
                </div>
              )}
            </div>
          );
        })}

        {displayGoals.length === 0 && (
          <div className="text-center py-8">
            <TargetIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No active goals</p>
            <p className="text-sm text-gray-400 mb-4">Set some goals to track your progress!</p>
            <Link
              to="/goals/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Goal
            </Link>
          </div>
        )}
      </div>

      {displayGoals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {displayGoals.filter(g => getProgressPercentage(g.currentValue, g.targetValue) >= 100).length} of {displayGoals.length} goals completed
            </span>
            <Link
              to="/goals/new"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Add new goal
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
