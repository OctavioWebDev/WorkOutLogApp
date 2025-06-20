// routes/goals.js
const express = require('express');
const {
  getAnnualGoals,
  createAnnualGoals,
  updateAnnualGoals,
  getGoalHistory,
  updateCurrentMaxes,
  addMonthlyCheckin,
  completeQuarterlyMilestone,
  getGoalAnalytics,
  getAnnualReview,
  createAnnualReview,
  updateAnnualReview,
  getMultiYearInsights,
  generateGoalSuggestions
} = require('../controllers/goalsController');

const {
  validateAnnualGoals,
  validateMonthlyCheckin,
  validateQuarterlyCompletion,
  validateAnnualReview,
  validateStrategy,
  validateMotivation
} = require('../middleware/goalsValidation');

const { protect, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// ======================
// ANNUAL GOALS ROUTES
// ======================

// Basic CRUD operations
router.route('/')
  .get(getAnnualGoals)
  .post(requireSubscription, validateAnnualGoals, createAnnualGoals);

router.route('/:id')
  .put(requireSubscription, validateAnnualGoals, updateAnnualGoals);

// Goal management
router.get('/history', getGoalHistory);
router.post('/:id/update-maxes', requireSubscription, updateCurrentMaxes);
router.get('/analytics', getGoalAnalytics);
router.get('/suggestions/:year', generateGoalSuggestions);

// Monthly check-ins
router.post('/:id/checkin', requireSubscription, validateMonthlyCheckin, addMonthlyCheckin);

// Quarterly milestones
router.post('/:id/quarter/:quarter/complete', 
  requireSubscription, 
  validateQuarterlyCompletion, 
  completeQuarterlyMilestone
);

// Goal components updates
router.put('/:id/strategy', requireSubscription, validateStrategy, (req, res, next) => {
  req.body = { strategy: req.body };
  next();
}, updateAnnualGoals);

router.put('/:id/motivation', requireSubscription, validateMotivation, (req, res, next) => {
  req.body = { motivation: req.body };
  next();
}, updateAnnualGoals);

// ======================
// ANNUAL REVIEW ROUTES
// ======================

// Annual review operations
router.route('/review/:year')
  .get(getAnnualReview)
  .post(requireSubscription, validateAnnualReview, createAnnualReview)
  .put(requireSubscription, validateAnnualReview, updateAnnualReview);

// Multi-year insights
router.get('/insights', getMultiYearInsights);

module.exports = router;