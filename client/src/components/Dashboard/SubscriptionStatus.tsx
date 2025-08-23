import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, CreditCardIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SubscriptionStatusProps {
  onDismiss?: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ onDismiss }) => {
  // Mock subscription data - replace with actual user data
  const subscriptionData = {
    status: 'trial',
    trialExpiry: '2024-02-01',
    daysRemaining: 3
  };

  const getDaysRemainingText = (days: number) => {
    if (days === 0) return 'expires today';
    if (days === 1) return 'expires tomorrow';
    return `expires in ${days} days`;
  };

  const getUrgencyStyles = (days: number) => {
    if (days <= 1) return 'bg-red-50 border-red-200 text-red-800';
    if (days <= 3) return 'bg-orange-50 border-orange-200 text-orange-800';
    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  };

  if (subscriptionData.status !== 'trial' || subscriptionData.daysRemaining > 7) {
    return null;
  }

  return (
    <div className={`rounded-lg border p-4 ${getUrgencyStyles(subscriptionData.daysRemaining)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            Your trial {getDaysRemainingText(subscriptionData.daysRemaining)}
          </h3>
          <div className="mt-2 text-sm">
            <p>
              Upgrade to Pro to continue accessing all features including advanced analytics, 
              unlimited workout logging, and competition planning.
            </p>
          </div>
          <div className="mt-4 flex space-x-3">
            <Link
              to="/subscription"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CreditCardIcon className="h-4 w-4 mr-1" />
              Upgrade Now
            </Link>
            <Link
              to="/subscription"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Plans
            </Link>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;
