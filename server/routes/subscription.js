// routes/subscription.js
const express = require('express');
const {
  getSubscriptionStatus,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  reactivateSubscription,
  getBillingHistory,
  getPricing,
  handleWebhook,
  validateCheckoutSession
} = require('../controllers/subscriptionController');

const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Webhook endpoint (must be before other middleware)
// Raw body parsing for Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Public routes
router.get('/pricing', getPricing);

// Protected routes (require authentication)
router.use(protect);

// Subscription management
router.get('/status', getSubscriptionStatus);

router.post('/checkout', [
  body('priceId')
    .optional()
    .isString()
    .withMessage('Price ID must be a string'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
], createCheckoutSession);

router.post('/portal', createPortalSession);
router.post('/cancel', cancelSubscription);
router.post('/reactivate', reactivateSubscription);

// Billing and history
router.get('/billing-history', getBillingHistory);
router.get('/validate-session/:sessionId', validateCheckoutSession);

module.exports = router;