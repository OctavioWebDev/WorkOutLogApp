// src/components/Layout/Layout.tsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  TargetIcon,
  UserIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'
import UserDropdown from './UserDropdown'
import NotificationDropdown from './NotificationDropdown'
import SubscriptionBanner from '../Subscription/SubscriptionBanner'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Workouts', href: '/workouts', icon: CalendarIcon },
    { name: 'Records', href: '/records', icon: ChartBarIcon },
    { name: 'Competitions', href: '/competitions', icon: TrophyIcon },
    { name: 'Goals', href: '/goals', icon: TargetIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ]

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    logout()
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  Powerlifting Tracker
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const current = isCurrentPath(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        current
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Mobile user section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                >
                  <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Profile
                </Link>
                <Link
                  to="/subscription"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                >
                  <CreditCardIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Subscription
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow">
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200">
            <TrophyIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Powerlifting Tracker
            </span>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const current = isCurrentPath(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        current
                          ? 'bg-primary-100 text-primary-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 ${
                          current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Desktop user section */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 justify-between items-center px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search workouts, competitions..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <div className="hidden lg:block">
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription banner */}
        <SubscriptionBanner />

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout