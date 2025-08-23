import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  price: number;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface CancellationReason {
  id: string;
  label: string;
  description?: string;
}

interface RetentionOffer {
  id: string;
  title: string;
  description: string;
  discount?: number;
  duration?: number;
  ctaText: string;
  highlight?: boolean;
}

const SubscriptionCancelPage: React.FC = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [showRetentionOffers, setShowRetentionOffers] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'reason' | 'offers' | 'confirm' | 'success'>('reason');

  const cancellationReasons: CancellationReason[] = [
    {
      id: 'too_expensive',
      label: 'Too expensive',
      description: 'The subscription cost is higher than I want to pay'
    },
    {
      id: 'not_using',
      label: 'Not using it enough',
      description: 'I don\'t use the app frequently enough to justify the cost'
    },
    {
      id: 'missing_features',
      label: 'Missing features I need',
      description: 'The app doesn\'t have specific features I require'
    },
    {
      id: 'found_alternative',
      label: 'Found a better alternative',
      description: 'I\'m switching to a different fitness app'
    },
    {
      id: 'technical_issues',
      label: 'Technical problems',
      description: 'I\'ve experienced bugs or performance issues'
    },
    {
      id: 'temporary_break',
      label: 'Taking a break',
      description: 'I want to pause my fitness tracking temporarily'
    },
    {
      id: 'other',
      label: 'Other reason',
      description: 'My reason isn\'t listed above'
    }
  ];

  const retentionOffers: RetentionOffer[] = [
    {
      id: 'discount_50',
      title: '50% Off Next 3 Months',
      description: 'Continue your fitness journey at half the price. Perfect time to reach your goals!',
      discount: 50,
      duration: 3,
      ctaText: 'Accept 50% Discount',
      highlight: true
    },
    {
      id: 'pause_subscription',
      title: 'Pause Your Subscription',
      description: 'Take a break for up to 3 months. Your data stays safe and you can resume anytime.',
      duration: 3,
      ctaText: 'Pause Subscription'
    },
    {
      id: 'downgrade_free',
      title: 'Switch to Free Plan',
      description: 'Keep basic features and your data. Upgrade back to Pro anytime you\'re ready.',
      ctaText: 'Downgrade to Free'
    }
  ];

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      const subscriptionData = await mockFetchSubscription();
      setSubscription(subscriptionData);
    } catch (err) {
      setError('Failed to load subscription details. Please try again.');
      console.error('Subscription fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual API call
  const mockFetchSubscription = async (): Promise<UserSubscription> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: 'sub_123',
      planId: 'pro-monthly',
      planName: 'Pro',
      price: 9.99,
      interval: 'monthly',
      status: 'active',
      currentPeriodStart: '2024-07-22',
      currentPeriodEnd: '2024-08-22',
      cancelAtPeriodEnd: false
    };
  };

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    
    // Show retention offers for certain reasons
    if (['too_expensive', 'not_using', 'temporary_break'].includes(reasonId)) {
      setShowRetentionOffers(true);
      setStep('offers');
    }
  };

  const handleRetentionOffer = async (offerId: string) => {
    try {
      setProcessing(true);
      
      // TODO: Implement retention offer logic
      console.log('Accepting retention offer:', offerId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect back to subscription page
      navigate('/subscription', { 
        state: { message: 'Retention offer applied successfully!' }
      });
    } catch (error) {
      console.error('Retention offer error:', error);
      setError('Failed to apply offer. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleProceedToCancel = () => {
    setStep('confirm');
  };

  const handleConfirmCancellation = async () => {
    try {
      setProcessing(true);
      
      // TODO: Implement actual cancellation logic
      console.log('Canceling subscription:', {
        subscriptionId: subscription?.id,
        reason: selectedReason,
        feedback
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep('success');
    } catch (error) {
      console.error('Cancellation error:', error);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setProcessing(false);
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
      <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
        <LoadingSpinner overlay text="Loading subscription details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Subscription</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchSubscription} 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h2>
          <p className="text-gray-600 mb-8">You don't have an active subscription to cancel.</p>
          <button 
            onClick={() => navigate('/subscription')} 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Canceled</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your subscription has been successfully canceled. You'll continue to have access to Pro features until{' '}
            <span className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</span>.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              We're sorry to see you go! Your account and data will remain safe, and you can reactivate anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/subscription')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Subscription
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancel Subscription</h1>
        <p className="text-gray-600">
          We're sorry to see you considering leaving. Let us know how we can help.
        </p>
      </div>

      {/* Current Subscription Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600">
              {subscription.planName} - {formatPrice(subscription.price)}/{subscription.interval}
            </p>
            <p className="text-sm text-gray-500">
              Renews on {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>

      {step === 'reason' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Help us understand why you're leaving
          </h2>
          
          <div className="space-y-4 mb-8">
            {cancellationReasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => handleReasonSelect(reason.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 ${
                  selectedReason === reason.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="font-medium text-gray-900 mb-1">{reason.label}</div>
                {reason.description && (
                  <div className="text-sm text-gray-600">{reason.description}</div>
                )}
              </button>
            ))}
          </div>

          {selectedReason === 'other' && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please tell us more about your reason for canceling
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your feedback helps us improve..."
              />
            </div>
          )}

          {selectedReason && !showRetentionOffers && (
            <div className="flex justify-between">
              <button
                onClick={() => navigate('/subscription')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleProceedToCancel}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue Cancellation
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'offers' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Wait! We have some special offers for you
          </h2>
          <p className="text-gray-600 mb-8">
            Before you go, check out these exclusive deals we can offer you right now.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {retentionOffers.map((offer) => (
              <div
                key={offer.id}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                  offer.highlight
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                {offer.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Best Deal
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-6">{offer.description}</p>

                <button
                  onClick={() => handleRetentionOffer(offer.id)}
                  disabled={processing}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    offer.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {processing ? 'Processing...' : offer.ctaText}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate('/subscription')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Keep Current Plan
            </button>
            <button
              onClick={handleProceedToCancel}
              className="px-6 py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              No Thanks, Cancel Anyway
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Are you sure you want to cancel?
            </h2>
            <p className="text-gray-600">
              This action will cancel your subscription at the end of your current billing period.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">What happens when you cancel:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                You'll keep Pro access until {formatDate(subscription.currentPeriodEnd)}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                Your data and workout history will be preserved
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                You can reactivate anytime with the same account
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">✗</span>
                You'll lose access to Pro features after the billing period ends
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">✗</span>
                Advanced analytics and unlimited goals will be restricted
              </li>
            </ul>
          </div>

          {selectedReason === 'other' && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any final feedback? (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Help us improve by sharing your thoughts..."
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/subscription')}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Keep My Subscription
            </button>
            <button
              onClick={handleConfirmCancellation}
              disabled={processing}
              className={`px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors ${
                processing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Canceling...
                </div>
              ) : (
                'Yes, Cancel My Subscription'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCancelPage;