// config/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe configuration
const stripeConfig = {
  // Product and price IDs (you'll create these in Stripe Dashboard)
  products: {
    annual: {
      priceId: process.env.STRIPE_ANNUAL_PRICE_ID, // e.g., 'price_1234567890'
      amount: 1200, // $12.00 in cents
      currency: 'usd',
      interval: 'year'
    }
  },
  
  // Webhook configuration
  webhookEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Customer portal configuration
  customerPortalUrl: process.env.STRIPE_CUSTOMER_PORTAL_URL,
  
  // Trial period (14 days)
  trialPeriodDays: 14,
  
  // Success and cancel URLs for checkout
  successUrl: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${process.env.CLIENT_URL}/subscription/cancel`,
  
  // Return URL for customer portal
  returnUrl: `${process.env.CLIENT_URL}/account/billing`
};

module.exports = {
  stripe,
  stripeConfig
};