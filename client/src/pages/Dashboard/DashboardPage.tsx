// src/pages/Dashboard/DashboardPage.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  CalendarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { FlagIcon as TargetIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import { apiClient } from '../../services/api'
import DashboardCard from '../../components/Dashboard/DashboardCard'
import RecentWorkouts from '../../components/Dashboard/RecentWorkouts'
import PRProgress from '../../components/Dashboard/PRProgress'
import UpcomingCompetitions from '../../components/Dashboard/UpcomingCompetitions'
import GoalProgress from '../../components/Dashboard/GoalProgress'
import SubscriptionStatus from '../../components/Dashboard/SubscriptionStatus'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { formatDate, isWithinDays } from '../../utils/dateUtils'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [workoutStats, recentPRs, competitions, goals] = await Promise.all([
        apiClient.get('/workouts/stats?period=30'),
        apiClient.get('/workouts/prs/recent?days=30&limit=5'),
        apiClient.get('/competitions/upcoming?days=90'),
        apiClient.get('/goals/analytics'),
      ])

      return {
        workoutStats: workoutStats.data.data,
        recentPRs: recentPRs.data.data,
        competitions: competitions.data.data,
        goals: goals.data.data,
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const { workoutStats, recentPRs, competitions, goals } = dashboardData || {}

  // Calculate streak and other metrics
  const currentStreak = workoutStats?.stats?.consistencyScore || 0
  const totalPRs = recentPRs?.recentPRs?.length || 0
  const nextCompetition = competitions?.competitions?.[0]
  const goalProgress = goals?.projections

  // Welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Check if trial is expiring soon
  const trialExpiringSoon = user?.subscriptionStatus === 'trial' && 
    user?.trialExpiry && 
    isWithinDays(new Date(user.trialExpiry), 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h1 
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {getWelcomeMessage()}, {user?.name}! 👋
          </motion.h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your training
          </p>
        </div>
        
        <motion.div 
          className="flex gap-3 mt-4 sm:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/workouts/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Log Workout
          </Link>
        </motion.div>
      </div>

      {/* Subscription Status Alert */}
      {trialExpiringSoon && (
        <SubscriptionStatus />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard
            title="Training Streak"
            value={`${currentStreak} days`}
            icon={<FireIcon className="h-6 w-6" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            subtitle="Keep it going!"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard
            title="Recent PRs"
            value={totalPRs}
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
            iconBg="bg-success-100"
            iconColor="text-success-600"
            subtitle="Last 30 days"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard
            title="Next Competition"
            value={nextCompetition ? `${nextCompetition.daysUntilCompetition} days` : 'None planned'}
            icon={<TrophyIcon className="h-6 w-6" />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            subtitle={nextCompetition?.name || 'Plan your next meet'}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard
            title="Total Volume"
            value={`${Math.round((workoutStats?.stats?.totalVolume || 0) / 1000)}k lbs`}
            icon={<ChartBarIcon className="h-6 w-6" />}
            iconBg="bg-primary-100"
            iconColor="text-primary-600"
            subtitle="Last 30 days"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RecentWorkouts />
          </motion.div>

          {/* PR Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <PRProgress />
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Goal Progress */}
          {goals?.currentGoals && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GoalProgress goals={goals.currentGoals} projections={goalProgress} />
            </motion.div>
          )}

          {/* Upcoming Competitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <UpcomingCompetitions competitions={competitions?.competitions || []} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/competitions/new"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <TrophyIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">Plan Competition</span>
              </Link>
              
              <Link
                to="/goals"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <TargetIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">Set Goals</span>
              </Link>
              
              <Link
                to="/analytics"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">View Analytics</span>
              </Link>
            </div>
          </motion.div>

          {/* Training Tips */}
          <motion.div
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h3 className="text-lg font-semibold text-primary-900 mb-2">💡 Training Tip</h3>
            <p className="text-primary-800 text-sm">
              Consistency beats perfection. Even a light training session is better than skipping entirely. 
              Keep your momentum going!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <motion.div
        className="bg-white rounded-lg shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Link to="/workouts" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {recentPRs?.recentPRs?.slice(0, 3).map((pr: any, index: number) => (
            <div key={pr.id} className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New PR: {pr.lift} - {pr.weight} lbs
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(pr.date)} • {pr.context}
                </p>
              </div>
            </div>
          ))}

          {(!recentPRs?.recentPRs || recentPRs.recentPRs.length === 0) && (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Start logging workouts to see your progress!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage