import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { apiClient } from '../../services/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  dateOfBirth?: string
  height?: number
  weight?: number
  weightClass?: string
  federation?: string
  experienceLevel: string
  subscriptionStatus: string
  subscriptionExpiry?: string
  trialExpiry?: string
  preferredUnits: string
  profileComplete: number
  hasActiveSubscription: boolean
  goals?: string[]
  preferences?: {
    units: 'metric' | 'imperial'
    notifications: boolean
    privacy: 'public' | 'friends' | 'private'
    theme: 'light' | 'dark' | 'auto'
  }
  stats?: {
    totalWorkouts: number
    totalDuration: number
    streakDays: number
    joinedDate: string
  }
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateUser, refreshUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      // Use the user data from auth context as base profile data
      const profileData: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        weightClass: user.weightClass,
        federation: user.federation,
        experienceLevel: user.experienceLevel,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
        trialExpiry: user.trialExpiry,
        preferredUnits: user.preferredUnits,
        profileComplete: user.profileComplete,
        hasActiveSubscription: user.hasActiveSubscription,
        preferences: {
          units: user.preferredUnits === 'metric' ? 'metric' : 'imperial',
          notifications: true,
          privacy: 'friends',
          theme: 'light'
        },
        stats: {
          totalWorkouts: 0,
          totalDuration: 0,
          streakDays: 0,
          joinedDate: new Date().toISOString()
        }
      }
      
      setProfile(profileData)
      setEditForm(profileData)
      
      // Fetch additional profile data from API
      fetchExtendedProfile()
    }
  }, [user])

  const fetchExtendedProfile = async () => {
    try {
      setLoading(true)
      // Try to get additional profile data and stats
      const [statsResponse] = await Promise.allSettled([
        apiClient.get('/workouts/stats?period=all')
      ])

      if (statsResponse.status === 'fulfilled') {
        const stats = statsResponse.value.data.data
        setProfile(prev => prev ? {
          ...prev,
          stats: {
            totalWorkouts: stats.totalWorkouts || 0,
            totalDuration: stats.totalDuration || 0,
            streakDays: stats.consistencyScore || 0,
            joinedDate: prev.stats?.joinedDate || new Date().toISOString()
          }
        } : null)
      }
    } catch (err) {
      console.warn('Could not fetch extended profile data:', err)
      // Don't show error - user data from auth context is sufficient
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!editForm || !user) return

    try {
      setSaving(true)
      setError(null)

      // Update user profile via API
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        weightClass: editForm.weightClass,
        federation: editForm.federation,
        experienceLevel: editForm.experienceLevel,
        preferredUnits: editForm.preferredUnits,
        height: editForm.height,
        weight: editForm.weight,
        dateOfBirth: editForm.dateOfBirth
      }

      const response = await apiClient.put('/auth/profile', updateData)
      
      // Update local state
      setProfile(prev => ({ ...prev!, ...editForm }))
      
      // Update auth context
      updateUser(response.data.data.user)
      
      setIsEditing(false)
      
    } catch (error: any) {
      console.error('Failed to save profile:', error)
      setError(error.response?.data?.message || 'Failed to save profile changes')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (field: keyof NonNullable<UserProfile['preferences']>, value: any) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [field]: value
      }
    }))
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
  }

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' }
    return { label: 'Obese', color: 'text-red-600' }
  }

  const getExperienceLevelColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSubscriptionStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'trial': return 'text-blue-600 bg-blue-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!user || !profile) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  const bmi = profile.height && profile.weight ? getBMI(profile.weight, profile.height) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">Manage your account and powerlifting preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={saving}
          className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isEditing 
              ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg shadow-gray-600/30' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30'
          }`}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=120&background=3b82f6&color=fff`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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
                      {profile.name}
                    </h2>
                    <p className="text-gray-600 mb-2">{profile.email}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {profile.dateOfBirth && (
                        <span className="text-gray-500">Age: {calculateAge(profile.dateOfBirth)}</span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(profile.experienceLevel)}`}>
                        {profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(profile.subscriptionStatus)}`}>
                        {profile.subscriptionStatus}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Powerlifting Specific Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight Class</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.weightClass || ''}
                    onChange={(e) => handleInputChange('weightClass', e.target.value)}
                    placeholder="e.g., 83kg, 93kg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.weightClass || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Federation</label>
                {isEditing ? (
                  <select
                    value={editForm.federation || ''}
                    onChange={(e) => handleInputChange('federation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Federation</option>
                    <option value="USAPL">USAPL</option>
                    <option value="USPA">USPA</option>
                    <option value="IPF">IPF</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.federation || 'Not set'}</p>
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

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <LoadingSpinner />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Workouts</span>
                  <span className="font-bold text-gray-900">{profile.stats?.totalWorkouts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-bold text-gray-900">{formatDuration(profile.stats?.totalDuration || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-bold text-orange-600 flex items-center gap-1">
                    {profile.stats?.streakDays || 0} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Complete</span>
                  <span className="font-bold text-blue-600">{profile.profileComplete}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/goals')}
                className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-xl">🎯</span>
                <span className="font-medium text-blue-900">Set Goals</span>
              </button>
              
              <button
                onClick={() => navigate('/workouts')}
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

              <button
                onClick={() => navigate('/competitions')}
                className="w-full px-4 py-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-xl">🏆</span>
                <span className="font-medium text-yellow-900">Competitions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage