// controllers/subscriptionController.js
const stripeService = require('../services/stripeService');
const { User } = require('../models');

// @desc    Get subscription status and details
// @route   GET /api/subscription/status
// @access  Private
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const user = req.user;
    
    let subscriptionDetails = null;
    
    // If user has a Stripe subscription, get details
    if (user.stripeSubscriptionId) {
      try {
        subscriptionDetails = await stripeService.getSubscription(user.stripeSubscriptionId);
      } catch (error) {
        console.error('Error fetching subscription details:', error);
      }
    }
    
    const status = {
      subscriptionStatus: user.subscriptionStatus,
      hasActiveSubscription: user.hasActiveSubscription(),
      subscriptionExpiry: user.subscriptionExpiry,
      trialExpiry: user.trialExpiry,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      
      // Trial information
      isOnTrial: user.subscriptionStatus === 'trial' && user.trialExpiry > new Date(),
      trialDaysRemaining: user.subscriptionStatus === 'trial' ? 
        Math.max(0, Math.ceil((user.trialExpiry - new Date()) / (1000 * 60 * 60 * 24))) : 0,
      
      // Subscription details from Stripe
      stripeSubscription: subscriptionDetails ? {
        id: subscriptionDetails.id,
        status: subscriptionDetails.status,
        currentPeriodStart: new Date(subscriptionDetails.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000),
        cancelAtPeriodEnd: subscriptionDetails.cancel_at_period_end,
        canceledAt: subscriptionDetails.canceled_at ? new Date(subscriptionDetails.canceled_at * 1000) : null,
        trialEnd: subscriptionDetails.trial_end ? new Date(subscriptionDetails.trial_end * 1000) : null
      } : null
    };
    
    res.status(200).json({
      status: 'success',
      data: status
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching subscription status'
    });
  }
};

// @desc    Create checkout session for subscription
// @route   POST /api/subscription/checkout
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    const user = req.user;
    const { priceId } = req.body;
    
    // Check if user already has an active subscription
    if (user.hasActiveSubscription() && user.subscriptionStatus === 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'User already has an active subscription'
      });
    }
    
    const session = await stripeService.createCheckoutSession(user, priceId);
    
    res.status(200).json({
      status: 'success',
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating checkout session'
    });
  }
};

// @desc    Create customer portal session
// @route   POST /api/subscription/portal
// @access  Private
exports.createPortalSession = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({
        status: 'error',
        message: 'User does not have a billing account'
      });
    }
    
    const session = await stripeService.createPortalSession(user);
    
    res.status(200).json({
      status: 'success',
      data: {
        url: session.url
      }
    });
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating customer portal session'
    });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({
        status: 'error',
        message: 'User does not have an active subscription'
      });
    }
    
    const subscription = await stripeService.cancelSubscription(user.stripeSubscriptionId);
    
    // Update user status
    user.subscriptionStatus = 'cancelled';
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Subscription cancelled successfully',
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error cancelling subscription'
    });
  }
};

// @desc    Reactivate subscription
// @route   POST /api/subscription/reactivate
// @access  Private
exports.reactivateSubscription = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({
        status: 'error',
        message: 'User does not have a subscription to reactivate'
      });
    }
    
    const subscription = await stripeService.reactivateSubscription(user.stripeSubscriptionId);
    
    // Update user status
    user.subscriptionStatus = subscription.status;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Subscription reactivated successfully',
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
      }
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error reactivating subscription'
    });
  }
};

// @desc    Get billing history
// @route   GET /api/subscription/billing-history
// @access  Private
exports.getBillingHistory = async (req, res) => {
  try {
    const user = req.user;
    const { limit = 10 } = req.query;
    
    if (!user.stripeCustomerId) {
      return res.status(200).json({
        status: 'success',
        data: {
          invoices: [],
          paymentMethods: []
        }
      });
    }
    
    // Get invoices and payment methods
    const [invoices, paymentMethods] = await Promise.all([
      stripeService.getInvoices(user.stripeCustomerId, parseInt(limit)),
      stripeService.getPaymentMethods(user.stripeCustomerId)
    ]);
    
    // Format invoice data
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: invoice.status,
      date: new Date(invoice.created * 1000),
      description: invoice.description || 'Powerlifting Tracker Subscription',
      downloadUrl: invoice.hosted_invoice_url,
      pdfUrl: invoice.invoice_pdf
    }));
    
    // Format payment method data
    const formattedPaymentMethods = paymentMethods.data.map(pm => ({
      id: pm.id,
      type: pm.type,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year
      } : null
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        invoices: formattedInvoices,
        paymentMethods: formattedPaymentMethods
      }
    });
  } catch (error) {
    console.error('Get billing history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching billing history'
    });
  }
};

// @desc    Get pricing information
// @route   GET /api/subscription/pricing
// @access  Public
exports.getPricing = async (req, res) => {
  try {
    const pricing = await stripeService.getPricing();
    
    res.status(200).json({
      status: 'success',
      data: {
        pricing,
        trialPeriodDays: 14,
        features: [
          'Unlimited workout tracking',
          'Personal record tracking',
          'Competition management',
          'Annual goal setting & reviews',
          'Weekly planning & analytics',
          'Multi-year progress insights',
          'Export capabilities',
          'Mobile-friendly interface'
        ]
      }
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching pricing information'
    });
  }
};

// @desc    Handle Stripe webhooks
// @route   POST /api/subscription/webhook
// @access  Public (but verified via Stripe signature)
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    // Verify webhook signature and construct event
    const event = stripeService.verifyWebhookSignature(req.body, signature);
    
    // Handle the event
    await stripeService.handleWebhookEvent(event);
    
    res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Webhook processing failed'
    });
  }
};

// @desc    Validate checkout session
// @route   GET /api/subscription/validate-session/:sessionId
// @access  Private
exports.validateCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user = req.user;
    
    // Retrieve the checkout session
    const session = await stripeService.stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify the session belongs to this user
    if (session.metadata.userId !== user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Session does not belong to this user'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        session: {
          id: session.id,
          paymentStatus: session.payment_status,
          subscriptionId: session.subscription,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total / 100
        }
      }
    });
  } catch (error) {
    console.error('Validate checkout session error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error validating checkout session'
    });
  }
};