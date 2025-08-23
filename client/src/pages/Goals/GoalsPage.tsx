import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'fitness' | 'weight' | 'strength' | 'endurance' | 'habit';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const GoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'progress'>('deadline');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const goalsData = await mockFetchGoals();
      setGoals(goalsData);
    } catch (err) {
      setError('Failed to load goals. Please try again.');
      console.error('Goals fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual API call
  const mockFetchGoals = async (): Promise<Goal[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: '1',
        title: 'Run 5K in under 30 minutes',
        description: 'Improve my cardiovascular fitness and achieve a sub-30 minute 5K time.',
        type: 'endurance',
        targetValue: 30,
        currentValue: 35,
        unit: 'minutes',
        deadline: '2024-12-31',
        priority: 'high',
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-08-20'
      },
      {
        id: '2',
        title: 'Lose 15 pounds',
        description: 'Reach my target weight through consistent exercise and healthy eating.',
        type: 'weight',
        targetValue: 15,
        currentValue: 8,
        unit: 'lbs',
        deadline: '2024-10-15',
        priority: 'medium',
        isActive: true,
        createdAt: '2024-06-01',
        updatedAt: '2024-08-22'
      },
      {
        id: '3',
        title: 'Bench press 200 lbs',
        description: 'Build upper body strength to bench press my body weight.',
        type: 'strength',
        targetValue: 200,
        currentValue: 175,
        unit: 'lbs',
        deadline: '2024-11-30',
        priority: 'medium',
        isActive: true,
        createdAt: '2024-03-10',
        updatedAt: '2024-08-18'
      }
    ];
  };

  const calculateProgress = (goal: Goal): number => {
    if (goal.targetValue === 0) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'fitness': return '🏃‍♂️';
      case 'weight': return '⚖️';
      case 'strength': return '💪';
      case 'endurance': return '🏃‍♀️';
      case 'habit': return '✅';
      default: return '🎯';
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.isActive;
    if (filter === 'completed') return calculateProgress(goal) >= 100;
    return true;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'progress':
        return calculateProgress(b) - calculateProgress(a);
      default:
        return 0;
    }
  });

  const handleUpdateProgress = async (goalId: string, newValue: number) => {
    try {
      // TODO: Replace with actual API call
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentValue: newValue, updatedAt: new Date().toISOString() }
          : goal
      ));
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      // TODO: Replace with actual API call
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Loading your goals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Goals</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchGoals} 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Goals</h1>
          <p className="text-lg text-gray-600">Track your fitness journey and achieve your targets</p>
        </div>
        <button
          onClick={() => navigate('/goals/create')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Create New Goal
        </button>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex bg-white rounded-lg p-1 shadow-md">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => setFilter('all')}
          >
            All Goals
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              filter === 'active' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'deadline' | 'priority' | 'progress')}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="progress">Sort by Progress</option>
        </select>
      </div>

      {/* Goals Grid */}
      {sortedGoals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Goals Found</h3>
          <p className="text-gray-600 mb-8">Start your fitness journey by creating your first goal!</p>
          <button
            onClick={() => navigate('/goals/create')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGoals.map((goal) => {
            const progress = calculateProgress(goal);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            
            return (
              <div key={goal.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden">
                {/* Goal Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(goal.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/goals/${goal.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit goal"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete goal"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </div>

                {/* Progress Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Current:</span>
                      <p className="font-semibold text-gray-900">{goal.currentValue} {goal.unit}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <p className="font-semibold text-gray-900">{goal.targetValue} {goal.unit}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Deadline:</span>
                      <span className={`font-medium ${daysLeft < 7 ? 'text-red-600' : daysLeft < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Progress Update */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Progress
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max={goal.targetValue}
                        step="0.1"
                        defaultValue={goal.currentValue}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onBlur={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          if (newValue !== goal.currentValue) {
                            handleUpdateProgress(goal.id, newValue);
                          }
                        }}
                      />
                      <span className="px-3 py-2 text-sm text-gray-500 bg-gray-50 rounded-md">
                        {goal.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsPage;