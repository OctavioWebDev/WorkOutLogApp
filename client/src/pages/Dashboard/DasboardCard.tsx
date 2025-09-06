import React from 'react'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  subtitle?: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  subtitle
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${iconBg}`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardCard