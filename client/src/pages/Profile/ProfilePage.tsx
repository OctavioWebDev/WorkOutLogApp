import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferences: {
    units: 'metric' | 'imperial';
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
    theme: 'light' | 'dark' | 'auto';
  };
  stats: {
    totalWorkouts: number;
    totalDuration: number;
    streakDays: number;
    joinedDate: string;
  };
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'workout' | 'goal' | 'streak' | 'milestone';
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const profileData = await mockFetchProfile();
      setProfile(profileData);
      setEditForm(profileData);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual API call
  const mockFetchProfile = async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '1990-05-15',
      height: 180,
      weight: 75,
      fitnessLevel: 'intermediate',
      goals: ['Weight Loss', 'Muscle Building', 'Endurance'],
      preferences: {
        units: 'metric',
        notifications: true,
        privacy: 'friends',
        theme: 'light'
      },
      stats: {
        totalWorkouts: 127,
        totalDuration: 6420, // minutes
        streakDays: 15,
        joinedDate: '2024-01-15'
      },
      achievements: [
        {
          id: '1',
          title: 'First Workout',
          description: 'Completed your first workout session',
          icon: '🏃‍♂️',
          unlockedAt: '2024-01-16',
          category: 'workout'
        },
        {
          id: '2',
          title: '30-Day Streak',
          description: 'Maintained a 30-day workout streak',
          icon: '🔥',
          unlockedAt: '2024-02-15',
          category: 'streak'
        },
        {
          id: '3',
          title: 'Goal Crusher',
          description: 'Completed 5 fitness goals',
          icon: '🎯',
          unlockedAt: '2024-07-20',
          category: 'goal'
        }
      ]
    };
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving profile:', editForm);
      
      setProfile(prev => ({ ...prev!, ...editForm }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: any) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [field]: value
      }
    }));
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const getFitnessLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAchievementCategoryColor = (category: string): string => {
    switch (category) {
      case 'workout': return 'bg-blue-100 text-blue-800';
      case 'goal': return 'bg-green-100 text-green-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'milestone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Loading your profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchProfile} 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const bmi = profile.height && profile.weight ? getBMI(profile.weight, profile.height) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">Manage your account and fitness preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 ${
            isEditing 
              ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg shadow-gray-600/30' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30'
          }`}
        >
          <span className="text-xl">{isEditing ? '✕' : '✏️'}</span>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=120&background=3b82f6&color=fff`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    📷
                  </button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editForm.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={editForm.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-gray-600 mb-2">{profile.email}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {profile.dateOfBirth && (
                        <span>Age: {calculateAge(profile.dateOfBirth)}</span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFitnessLevelColor(profile.fitnessLevel)}`}>
                        {profile.fitnessLevel.charAt(0).toUpperCase() + profile.fitnessLevel.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Physical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={editForm.height || ''}
                      onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {profile.height ? `${profile.height} cm` : 'Not set'}
                    </div>
                    <div className="text-sm font-medium text-blue-800">Height</div>
                  </>
                )}
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={editForm.weight || ''}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {profile.weight ? `${profile.weight} kg` : 'Not set'}
                    </div>
                    <div className="text-sm font-medium text-green-800">Weight</div>
                  </>
                )}
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {bmi ? bmi.toFixed(1) : 'N/A'}
                </div>
                <div className="text-sm font-medium text-purple-800">BMI</div>
                {bmiCategory && (
                  <div className={`text-xs font-medium mt-1 ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </div>
                )}
              </div>
            </div>

            {/* Fitness Goals */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitness Goals</h3>
              {isEditing ? (
                <textarea
                  value={editForm.goals?.join('\n') || ''}
                  onChange={(e) => handleInputChange('goals', e.target.value.split('\n').filter(g => g.trim()))}
                  placeholder="Enter your fitness goals (one per line)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                <select
                  value={editForm.preferences?.units || profile.preferences.units}
                  onChange={(e) => handlePreferenceChange('units', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="metric">Metric (kg, cm)</option>
                  <option value="imperial">Imperial (lbs, ft)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                <select
                  value={editForm.preferences?.privacy || profile.preferences.privacy}
                  onChange={(e) => handlePreferenceChange('privacy', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={editForm.preferences?.theme || profile.preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={editForm.preferences?.notifications ?? profile.preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <label htmlFor="notifications" className="ml-2 text-sm font-medium text-gray-700">
                  Enable Notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Workouts</span>
                <span className="font-bold text-gray-900">{profile.stats.totalWorkouts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Duration</span>
                <span className="font-bold text-gray-900">{formatDuration(profile.stats.totalDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-bold text-orange-600 flex items-center gap-1">
                  🔥 {profile.stats.streakDays} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="font-bold text-gray-900">
                  {new Date(profile.stats.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            
            <div className="space-y-3">
              {profile.achievements.slice(0, 5).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAchievementCategoryColor(achievement.category)}`}>
                    {achievement.category}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/achievements')}
              className="w-full mt-4 px-4 py-2 text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
            >
              View All Achievements
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/goals/create')}
                className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-xl">🎯</span>
                <span className="font-medium text-blue-900">Create New Goal</span>
              </button>
              
              <button
                onClick={() => navigate('/workouts/log')}
                className="w-full px-4 py-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-xl">💪</span>
                <span className="font-medium text-green-900">Log Workout</span>
              </button>
              
              <button
                onClick={() => navigate('/analytics')}
                className="w-full px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-xl">📊</span>
                <span className="font-medium text-purple-900">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;