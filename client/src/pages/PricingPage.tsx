import React from 'react'

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Honest Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need for just $12 per year. That's $1 per month!
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-200 max-w-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Annual Plan</h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-white">$12</span>
                  <span className="text-xl text-indigo-100">/year</span>
                </div>
                <p className="text-indigo-100 mt-2">Just $1 per month!</p>
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="space-y-4 mb-8">
                {[
                  'Unlimited workout tracking',
                  'Personal record tracking',
                  'Competition management',
                  'Annual goal setting & reviews',
                  'Weekly planning & analytics',
                  'Multi-year progress insights',
                  'Export capabilities',
                  'Mobile-friendly interface'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button className="w-full bg-indigo-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">
                  Start Your Free Trial
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  14-day free trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
