import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
  favoriteExercise: string;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }>;
}

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [workoutTrends, setWorkoutTrends] = useState<ChartData | null>(null);
  const [exerciseBreakdown, setExerciseBreakdown] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API calls
      const [statsResponse, trendsResponse, exercisesResponse] = await Promise.all([
        fetchWorkoutStats(timeRange),
        fetchWorkoutTrends(timeRange),
        fetchExerciseBreakdown(timeRange)
      ]);

      setStats(statsResponse);
      setWorkoutTrends(trendsResponse);
      setExerciseBreakdown(exercisesResponse);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API functions - replace with actual API calls
  const fetchWorkoutStats = async (range: string): Promise<WorkoutStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalWorkouts: 24,
      totalDuration: 1440, // minutes
      averageDuration: 60,
      favoriteExercise: 'Push-ups',
      weeklyGoalProgress: 85,
      monthlyGoalProgress: 72
    };
  };

  const fetchWorkoutTrends = async (range: string): Promise<ChartData> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Workouts Completed',
        data: [5, 7, 6, 8],
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8'
      }]
    };
  };

  const fetchExerciseBreakdown = async (range: string): Promise<ChartData> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      labels: ['Cardio', 'Strength', 'Flexibility', 'Sports'],
      datasets: [{
        label: 'Exercise Types',
        data: [30, 45, 15, 10],
        backgroundColor: ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    };
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Loading your analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Analytics</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchAnalyticsData} 
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Workout Analytics</h1>
        <div className="flex bg-white rounded-lg p-1 shadow-md">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              timeRange === 'week' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              timeRange === 'month' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              timeRange === 'year' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => setTimeRange('year')}
          >
            This Year
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 flex items-center justify-center text-3xl bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg">
                🏋️
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Total Workouts
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalWorkouts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 flex items-center justify-center text-3xl bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
                ⏱️
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Total Duration
                </h3>
                <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.totalDuration)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 flex items-center justify-center text-3xl bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg">
                📊
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Average Duration
                </h3>
                <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.averageDuration)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 flex items-center justify-center text-3xl bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl shadow-lg">
                ⭐
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Favorite Exercise
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stats.favoriteExercise}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Workout Trends</h3>
          <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            {workoutTrends ? (
              <div className="text-center text-gray-600">
                <p className="text-lg mb-2">📈 Chart: {workoutTrends.datasets[0].label}</p>
                <p className="font-medium">Data: {workoutTrends.datasets[0].data.join(', ')}</p>
              </div>
            ) : (
              <LoadingSpinner text="Loading trends..." />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Exercise Breakdown</h3>
          <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            {exerciseBreakdown ? (
              <div className="text-center text-gray-600">
                <p className="text-lg mb-4">🥧 Chart: Exercise Distribution</p>
                <ul className="space-y-2">
                  {exerciseBreakdown.labels.map((label, index) => (
                    <li key={label} className="text-sm font-medium">
                      {label}: {exerciseBreakdown.datasets[0].data[index]}%
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <LoadingSpinner text="Loading breakdown..." />
            )}
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Goal Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.weeklyGoalProgress}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-600">{stats.weeklyGoalProgress}% Complete</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Goal Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.monthlyGoalProgress}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-600">{stats.monthlyGoalProgress}% Complete</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;