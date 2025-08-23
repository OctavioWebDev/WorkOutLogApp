import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface SubscriptionDetails {
  id: string;
  planId: string;
  planName: string;
  price: number;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  features: string[];
}

interface WelcomeStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  ctaAction: () => void;
  completed?: boolean;
}

const SubscriptionSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Get subscription details from URL params
  const sessionId = searchParams.get('session_id');
  const planId = searchParams.get('plan_id');

  useEffect(() => {
    if (sessionId || planId) {
      fetchSubscriptionDetails();
    } else {
      setError('Invalid subscription session. Please try again.');
      setLoading(false);
    }
  }, [sessionId, planId]);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call to verify subscription
      const subscriptionData = await mockFetchSubscriptionDetails(sessionId, planId);
      setSubscription(subscriptionData);
    } catch (err) {
      setError('Failed to load subscription details. Please contact support.');
      console.error('Subscription verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual API call
  const mockFetchSubscriptionDetails = async (sessionId: string | null, planId: string | null): Promise<SubscriptionDetails> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different plan types
    const plans = {
      'pro-monthly': {
        planName: 'Pro',
        price: 9.99,
        interval: 'monthly' as const,
        features: [
          'Unlimited workout tracking',
          'Unlimited goals',
          'Advanced analytics & insights',
          'Custom workout plans',
          'Progress photos',
          'Priority support',
          'Export data'
        ]
      },
      'pro-yearly': {
        planName: 'Pro',
        price: 99.99,
        interval: 'yearly' as const,
        features: [
          'Unlimited workout tracking',
          'Unlimited goals',
          'Advanced analytics & insights',
          'Custom workout plans',
          'Progress photos',
          'Priority support',
          'Export data',
          '2 months free!'
        ]
      },
      'premium-monthly': {
        planName: 'Premium',
        price: 19.99,
        interval: 'monthly' as const,
        features: [
          'Everything in Pro',
          'Personal trainer AI',
          'Nutrition tracking',
          'Meal planning',
          'Video workout library',
          'Live coaching sessions',
          'Advanced body composition',
          'White-label app access'
        ]
      }
    };

    const selectedPlan = plans[planId as keyof typeof plans] || plans['pro-monthly'];
    
    return {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      planId: planId || 'pro-monthly',
      ...selectedPlan,
      status: 'active',
      currentPeriodStart: new Date().toISOString().split('T')[0],
      currentPeriodEnd: new Date(Date.now() + (selectedPlan.interval === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  };

  const welcomeSteps: WelcomeStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your fitness goals, measurements, and preferences to get personalized recommendations.',
      icon: '👤',
      ctaText: 'Set Up Profile',
      ctaAction: () => {
        markStepCompleted('profile');
        navigate('/profile');
      }
    },
    {
      id: 'first-goal',
      title: 'Create Your First Goal',
      description: 'Set a specific, measurable fitness goal to start tracking your progress.',
      icon: '🎯',
      ctaText: 'Create Goal',
      ctaAction: () => {
        markStepCompleted('first-goal');
        navigate('/goals/create');
      }
    },
    {
      id: 'log-workout',
      title: 'Log Your First Workout',
      description: 'Record a workout to see how our advanced tracking and analytics work.',
      icon: '💪',
      ctaText: 'Log Workout',
      ctaAction: () => {
        markStepCompleted('log-workout');
        navigate('/workouts/log');
      }
    },
    {
      id: 'explore-features',
      title: 'Explore Premium Features',
      description: 'Discover analytics, custom plans, and all the tools now available to you.',
      icon: '✨',
      ctaText: 'Explore Features',
      ctaAction: () => {
        markStepCompleted('explore-features');
        navigate('/dashboard');
      }
    }
  ];

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getSavingsAmount = (price: number, interval: string): number => {
    if (interval === 'yearly') {
      const monthlyEquivalent = (price / 12);
      const regularMonthlyPrice = interval === 'yearly' ? 9.99 : price;
      return (regularMonthlyPrice * 12) - price;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Confirming your subscription..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Subscription Error</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/subscription')} 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Plans
            </button>
            <button 
              onClick={() => navigate('/support')} 
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const savings = getSavingsAmount(subscription.price, subscription.interval);

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to {subscription.planName}!</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your subscription is now active. Get ready to supercharge your fitness journey with premium features!
        </p>
      </div>

      {/* Subscription Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan:</span>
                <span className="font-semibold text-gray-900">{subscription.planName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subscription.price)}/{subscription.interval}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annual Savings:</span>
                  <span className="font-semibold text-green-600">
                    {formatPrice(savings)} saved!
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {subscription.status === 'trialing' ? 'Free Trial' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {subscription.status === 'trialing' ? 'Trial Ends:' : 'Next Billing:'}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatDate(subscription.trialEnd || subscription.currentPeriodEnd)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
            <ul className="space-y-2">
              {subscription.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {subscription.status === 'trialing' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h4 className="font-semibold text-blue-900">Free Trial Active</h4>
                <p className="text-blue-700 text-sm">
                  Enjoy full access to all premium features until {formatDate(subscription.trialEnd!)}. 
                  You won't be charged until your trial ends.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Getting Started Steps */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get Started in 4 Easy Steps</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {welcomeSteps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStep && !isCompleted;
            
            return (
              <div
                key={step.id}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : isCurrent
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCompleted ? 'bg-green-100' : isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    
                    <button
                      onClick={step.ctaAction}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {isCompleted ? 'Completed' : step.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
          <h3 className="font-semibold text-blue-900 mb-2">View Dashboard</h3>
          <p className="text-blue-700 text-sm">See your fitness overview and recent activity</p>
        </button>

        <button
          onClick={() => navigate('/analytics')}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📈</div>
          <h3 className="font-semibold text-purple-900 mb-2">Advanced Analytics</h3>
          <p className="text-purple-700 text-sm">Dive deep into your fitness data and trends</p>
        </button>

        <button
          onClick={() => navigate('/subscription')}
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
          <h3 className="font-semibold text-green-900 mb-2">Manage Subscription</h3>
          <p className="text-green-700 text-sm">Update billing, view invoices, or change plans</p>
        </button>
      </div>

      {/* Support Section */}
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help Getting Started?</h3>
        <p className="text-gray-600 mb-6">
          Our support team is here to help you make the most of your premium subscription.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/help')}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
          >
            Browse Help Center
          </button>
          <button
            onClick={() => navigate('/support')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;