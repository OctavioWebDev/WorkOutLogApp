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
  completedAt?: string;
}

interface Review {
  id: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  goalsReviewed: number;
  goalsCompleted: number;
  averageProgress: number;
  insights: string[];
  achievements: string[];
  challenges: string[];
  nextPeriodFocus: string;
  createdAt: string;
}

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [newReview, setNewReview] = useState({
    insights: '',
    achievements: '',
    challenges: '',
    nextPeriodFocus: ''
  });

  useEffect(() => {
    fetchReviewData();
  }, []);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API calls
      const [goalsData, reviewsData] = await Promise.all([
        mockFetchGoals(),
        mockFetchReviews()
      ]);
      
      setGoals(goalsData);
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to load review data. Please try again.');
      console.error('Review fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API functions - replace with actual API calls
  const mockFetchGoals = async (): Promise<Goal[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: '1',
        title: 'Run 5K in under 30 minutes',
        description: 'Improve cardiovascular fitness',
        type: 'endurance',
        targetValue: 30,
        currentValue: 28,
        unit: 'minutes',
        deadline: '2024-12-31',
        priority: 'high',
        isActive: true,
        createdAt: '2024-01-15',
        completedAt: '2024-08-15'
      },
      {
        id: '2',
        title: 'Lose 15 pounds',
        description: 'Reach target weight',
        type: 'weight',
        targetValue: 15,
        currentValue: 12,
        unit: 'lbs',
        deadline: '2024-10-15',
        priority: 'medium',
        isActive: true,
        createdAt: '2024-06-01'
      }
    ];
  };

  const mockFetchReviews = async (): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: '1',
        period: 'monthly',
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        goalsReviewed: 5,
        goalsCompleted: 2,
        averageProgress: 78,
        insights: [
          'Consistency in morning workouts improved significantly',
          'Nutrition tracking helped with weight loss goals',
          'Recovery time between workouts decreased'
        ],
        achievements: [
          'Completed first 5K run',
          'Lost 8 pounds this month',
          'Maintained workout streak for 25 days'
        ],
        challenges: [
          'Weekend meal planning needs improvement',
          'Strength training frequency was inconsistent',
          'Sleep schedule affected energy levels'
        ],
        nextPeriodFocus: 'Focus on strength training consistency and meal prep for weekends',
        createdAt: '2024-08-01'
      }
    ];
  };

  const calculateProgress = (goal: Goal): number => {
    if (goal.targetValue === 0) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getCompletedGoals = (): Goal[] => {
    return goals.filter(goal => calculateProgress(goal) >= 100 || goal.completedAt);
  };

  const getActiveGoals = (): Goal[] => {
    return goals.filter(goal => goal.isActive && calculateProgress(goal) < 100);
  };

  const getCurrentPeriodStats = () => {
    const completedGoals = getCompletedGoals();
    const activeGoals = getActiveGoals();
    const totalGoals = goals.length;
    const averageProgress = totalGoals > 0 
      ? goals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / totalGoals 
      : 0;

    return {
      totalGoals,
      completedGoals: completedGoals.length,
      activeGoals: activeGoals.length,
      averageProgress: Math.round(averageProgress)
    };
  };

  const handleCreateReview = async () => {
    try {
      const stats = getCurrentPeriodStats();
      const review: Omit<Review, 'id' | 'createdAt'> = {
        period: selectedPeriod,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        goalsReviewed: stats.totalGoals,
        goalsCompleted: stats.completedGoals,
        averageProgress: stats.averageProgress,
        insights: newReview.insights.split('\n').filter(line => line.trim()),
        achievements: newReview.achievements.split('\n').filter(line => line.trim()),
        challenges: newReview.challenges.split('\n').filter(line => line.trim()),
        nextPeriodFocus: newReview.nextPeriodFocus
      };

      // TODO: Replace with actual API call
      console.log('Creating review:', review);
      
      // Reset form
      setNewReview({
        insights: '',
        achievements: '',
        challenges: '',
        nextPeriodFocus: ''
      });
      setShowCreateReview(false);
      
      // Refresh data
      await fetchReviewData();
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  const getPeriodLabel = (period: string): string => {
    switch (period) {
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return period;
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Loading your review data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Review Data</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchReviewData} 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = getCurrentPeriodStats();

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Goal Reviews</h1>
          <p className="text-lg text-gray-600">Reflect on your progress and plan for success</p>
        </div>
        <button
          onClick={() => setShowCreateReview(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <span className="text-xl">📝</span>
          Create Review
        </button>
      </div>

      {/* Current Period Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Period Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalGoals}</div>
            <div className="text-sm font-medium text-blue-800">Total Goals</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.completedGoals}</div>
            <div className="text-sm font-medium text-green-800">Completed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.activeGoals}</div>
            <div className="text-sm font-medium text-yellow-800">Active</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.averageProgress}%</div>
            <div className="text-sm font-medium text-purple-800">Avg Progress</div>
          </div>
        </div>

        {/* Goals Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completed Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✅</span>
              Completed Goals ({getCompletedGoals().length})
            </h3>
            <div className="space-y-3">
              {getCompletedGoals().slice(0, 3).map(goal => (
                <div key={goal.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xl">{getTypeIcon(goal.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{goal.title}</div>
                    <div className="text-sm text-gray-600">{goal.currentValue} {goal.unit}</div>
                  </div>
                  <div className="text-green-600 font-bold">100%</div>
                </div>
              ))}
              {getCompletedGoals().length === 0 && (
                <div className="text-gray-500 text-center py-4">No completed goals yet</div>
              )}
            </div>
          </div>

          {/* Active Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">🎯</span>
              Active Goals ({getActiveGoals().length})
            </h3>
            <div className="space-y-3">
              {getActiveGoals().slice(0, 3).map(goal => {
                const progress = calculateProgress(goal);
                return (
                  <div key={goal.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-xl">{getTypeIcon(goal.type)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{goal.title}</div>
                      <div className="text-sm text-gray-600">{goal.currentValue} / {goal.targetValue} {goal.unit}</div>
                    </div>
                    <div className="text-blue-600 font-bold">{progress.toFixed(0)}%</div>
                  </div>
                );
              })}
              {getActiveGoals().length === 0 && (
                <div className="text-gray-500 text-center py-4">No active goals</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Reviews */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Previous Reviews</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="weekly">Weekly Reviews</option>
            <option value="monthly">Monthly Reviews</option>
            <option value="quarterly">Quarterly Reviews</option>
            <option value="yearly">Yearly Reviews</option>
          </select>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-6">Create your first review to track your progress over time</p>
            <button
              onClick={() => setShowCreateReview(true)}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Review
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getPeriodLabel(review.period)} Review
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(review.startDate).toLocaleDateString()} - {new Date(review.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{review.averageProgress}%</div>
                    <div className="text-sm text-gray-600">Avg Progress</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-green-600">🎉</span>
                      Achievements
                    </h4>
                    <ul className="space-y-1">
                      {review.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-gray-600">• {achievement}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-red-600">⚠️</span>
                      Challenges
                    </h4>
                    <ul className="space-y-1">
                      {review.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm text-gray-600">• {challenge}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">💡</span>
                      Insights
                    </h4>
                    <ul className="space-y-1">
                      {review.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600">• {insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {review.nextPeriodFocus && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-purple-600">🎯</span>
                      Next Period Focus
                    </h4>
                    <p className="text-sm text-gray-600">{review.nextPeriodFocus}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Review Modal */}
      {showCreateReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">Create New Review</h3>
              <p className="text-gray-600 mt-1">Reflect on your progress and set focus for the next period</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Achievements (one per line)
                </label>
                <textarea
                  value={newReview.achievements}
                  onChange={(e) => setNewReview(prev => ({ ...prev, achievements: e.target.value }))}
                  placeholder="List your major accomplishments..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenges Faced (one per line)
                </label>
                <textarea
                  value={newReview.challenges}
                  onChange={(e) => setNewReview(prev => ({ ...prev, challenges: e.target.value }))}
                  placeholder="What obstacles did you encounter..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Insights (one per line)
                </label>
                <textarea
                  value={newReview.insights}
                  onChange={(e) => setNewReview(prev => ({ ...prev, insights: e.target.value }))}
                  placeholder="What did you learn about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Period Focus
                </label>
                <textarea
                  value={newReview.nextPeriodFocus}
                  onChange={(e) => setNewReview(prev => ({ ...prev, nextPeriodFocus: e.target.value }))}
                  placeholder="What will you focus on next..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowCreateReview(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReview}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;