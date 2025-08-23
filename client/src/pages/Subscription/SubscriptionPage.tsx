import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  description: string;
  stripePriceId?: string;
}

interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

interface BillingHistory {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  invoiceUrl?: string;
  description: string;
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [showBillingHistory, setShowBillingHistory] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API calls
      const [plansData, subscriptionData, billingData] = await Promise.all([
        mockFetchPlans(),
        mockFetchCurrentSubscription(),
        mockFetchBillingHistory()
      ]);
      
      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
      setBillingHistory(billingData);
    } catch (err) {
      setError('Failed to load subscription data. Please try again.');
      console.error('Subscription fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API functions - replace with actual API calls
  const mockFetchPlans = async (): Promise<SubscriptionPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'monthly',
        description: 'Perfect for getting started with your fitness journey',
        features: [
          'Basic workout tracking',
          'Up to 3 goals',
          'Basic analytics',
          'Community access'
        ]
      },
      {
        id: 'pro-monthly',
        name: 'Pro',
        price: 9.99,
        interval: 'monthly',
        popular: true,
        description: 'Everything you need for serious fitness tracking',
        features: [
          'Unlimited workout tracking',
          'Unlimited goals',
          'Advanced analytics & insights',
          'Custom workout plans',
          'Progress photos',
          'Priority support',
          'Export data'
        ],
        stripePriceId: 'price_pro_monthly'
      },
      {
        id: 'pro-yearly',
        name: 'Pro',
        price: 99.99,
        interval: 'yearly',
        description: 'Save 17% with annual billing',
        features: [
          'Unlimited workout tracking',
          'Unlimited goals',
          'Advanced analytics & insights',
          'Custom workout plans',
          'Progress photos',
          'Priority support',
          'Export data',
          '2 months free!'
        ],
        stripePriceId: 'price_pro_yearly'
      },
      {
        id: 'premium-monthly',
        name: 'Premium',
        price: 19.99,
        interval: 'monthly',
        description: 'For fitness enthusiasts who want it all',
        features: [
          'Everything in Pro',
          'Personal trainer AI',
          'Nutrition tracking',
          'Meal planning',
          'Video workout library',
          'Live coaching sessions',
          'Advanced body composition',
          'White-label app access'
        ],
        stripePriceId: 'price_premium_monthly'
      }
    ];
  };

  const mockFetchCurrentSubscription = async (): Promise<UserSubscription | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return null for free users, or subscription data for paid users
    return {
      id: 'sub_123',
      planId: 'pro-monthly',
      status: 'active',
      currentPeriodStart: '2024-07-22',
      currentPeriodEnd: '2024-08-22',
      cancelAtPeriodEnd: false
    };
  };

  const mockFetchBillingHistory = async (): Promise<BillingHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        id: 'inv_1',
        amount: 9.99,
        status: 'paid',
        date: '2024-07-22',
        description: 'Pro Monthly Subscription',
        invoiceUrl: '#'
      },
      {
        id: 'inv_2',
        amount: 9.99,
        status: 'paid',
        date: '2024-06-22',
        description: 'Pro Monthly Subscription',
        invoiceUrl: '#'
      },
      {
        id: 'inv_3',
        amount: 9.99,
        status: 'paid',
        date: '2024-05-22',
        description: 'Pro Monthly Subscription',
        invoiceUrl: '#'
      }
    ];
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setProcessingPlanId(planId);
      
      // TODO: Integrate with Stripe or payment processor
      console.log('Subscribing to plan:', planId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh subscription data
      await fetchSubscriptionData();
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // TODO: Implement cancellation logic
      console.log('Canceling subscription');
      
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          cancelAtPeriodEnd: true
        });
      }
    } catch (error) {
      console.error('Cancellation error:', error);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      // TODO: Implement reactivation logic
      console.log('Reactivating subscription');
      
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          cancelAtPeriodEnd: false
        });
      }
    } catch (error) {
      console.error('Reactivation error:', error);
    }
  };

  const getCurrentPlan = (): SubscriptionPlan | null => {
    if (!currentSubscription) return null;
    return plans.find(plan => plan.id === currentSubscription.planId) || null;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trialing': return 'text-blue-600 bg-blue-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBillingStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Loading subscription details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Subscription</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchSubscriptionData} 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscription & Billing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the perfect plan for your fitness journey. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSubscription.status)}`}>
                  {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                </span>
              </div>
              
              {currentPlan && (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">
                    {currentPlan.name} - {formatPrice(currentPlan.price)}/{currentPlan.interval}
                  </p>
                  <p className="text-gray-600">
                    {currentSubscription.cancelAtPeriodEnd 
                      ? `Cancels on ${formatDate(currentSubscription.currentPeriodEnd)}`
                      : `Renews on ${formatDate(currentSubscription.currentPeriodEnd)}`
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {currentSubscription.cancelAtPeriodEnd ? (
                <button
                  onClick={handleReactivateSubscription}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Reactivate
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  className="px-6 py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
              
              <button
                onClick={() => setShowBillingHistory(!showBillingHistory)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showBillingHistory ? 'Hide' : 'View'} Billing History
              </button>
            </div>
          </div>

          {/* Billing History */}
          {showBillingHistory && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
              <div className="space-y-3">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBillingStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">{invoice.description}</div>
                        <div className="text-sm text-gray-600">{formatDate(invoice.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">{formatPrice(invoice.amount)}</span>
                      {invoice.invoiceUrl && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan?.id === plan.id;
          const isProcessing = processingPlanId === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              } ${isCurrentPlan ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Current
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.interval}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan || isProcessing}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  isCurrentPlan
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:-translate-y-0.5'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : plan.price === 0 ? (
                  'Get Started Free'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, 
              or at the end of your current billing period for downgrades.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. 
              All payments are processed securely through Stripe.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 text-sm">
              New users get a 14-day free trial of our Pro plan. No credit card required to start your trial.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600 text-sm">
              Absolutely! You can cancel your subscription at any time. You'll continue to have access 
              to premium features until the end of your current billing period.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Need help choosing a plan or have questions?</p>
        <button
          onClick={() => navigate('/support')}
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPage;