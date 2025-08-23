import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon, 
  CreditCardIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useAuth();

  // Mock subscription data - replace with actual user data
  const subscriptionData = {
    status: 'trial', // 'trial', 'active', 'expired', 'cancelled'
    trialExpiry: '2024-02-01',
    daysRemaining: 3,
    plan: 'free'
  };

  const getDaysRemainingText = (days: number) => {
    if (days === 0) return 'expires today';
    if (days === 1) return 'expires tomorrow';
    return `expires in ${days} days`;
  };

  const getBannerConfig = () => {
    const { status, daysRemaining } = subscriptionData;

    if (status === 'trial') {
      if (daysRemaining <= 1) {
        return {
          type: 'urgent',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          icon: ExclamationTriangleIcon,
          title: `Your trial ${getDaysRemainingText(daysRemaining)}!`,
          message: 'Upgrade now to continue accessing all premium features.',
          ctaText: 'Upgrade Now',
          ctaStyle: 'bg-red-600 hover:bg-red-700 text-white'
        };
      } else if (daysRemaining <= 7) {
        return {
          type: 'warning',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-500',
          icon: ExclamationTriangleIcon,
          title: `Your trial ${getDaysRemainingText(daysRemaining)}`,
          message: 'Don\'t lose access to your workout data and analytics.',
          ctaText: 'View Plans',
          ctaStyle: 'bg-orange-600 hover:bg-orange-700 text-white'
        };
      }
    }

    if (status === 'expired' || status === 'cancelled') {
      return {
        type: 'expired',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800',
        iconColor: 'text-gray-500',
        icon: ExclamationTriangleIcon,
        title: 'Your subscription has expired',
        message: 'Reactivate your subscription to access all features.',
        ctaText: 'Reactivate',
        ctaStyle: 'bg-primary-600 hover:bg-primary-700 text-white'
      };
    }

    // Show upgrade banner for free users occasionally
    if (status === 'free' && Math.random() > 0.7) {
      return {
        type: 'upgrade',
        bgColor: 'bg-gradient-to-r from-primary-50 to-blue-50',
        borderColor: 'border-primary-200',
        textColor: 'text-primary-800',
        iconColor: 'text-primary-500',
        icon: SparklesIcon,
        title: 'Unlock Premium Features',
        message: 'Get advanced analytics, unlimited workouts, and competition planning.',
        ctaText: 'Upgrade to Pro',
        ctaStyle: 'bg-primary-600 hover:bg-primary-700 text-white'
      };
    }

    return null;
  };

  const bannerConfig = getBannerConfig();

  if (!bannerConfig || isDismissed) {
    return null;
  }

  const { 
    bgColor, 
    borderColor, 
    textColor, 
    iconColor, 
    icon: Icon, 
    title, 
    message, 
    ctaText, 
    ctaStyle 
  } = bannerConfig;

  return (
    <div className={`${bgColor} border-b ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <span className={`flex p-2 rounded-lg ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="ml-3 flex-1 min-w-0">
                <p className={`text-sm font-medium ${textColor}`}>
                  {title}
                </p>
                <p className={`text-sm ${textColor} opacity-90`}>
                  {message}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <Link
                to="/subscription"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${ctaStyle} transition-colors`}
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                {ctaText}
              </Link>
              
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className={`${textColor} hover:opacity-75 p-1 rounded-md`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
