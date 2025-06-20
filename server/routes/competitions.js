// routes/competitions.js
const express = require('express');
const {
  getCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getUpcomingCompetitions,
  getCompetitionHistory,
  getCompetitionStats,
  getSuggestedAttempts,
  updatePlannedAttempts,
  recordResults,
  completeCompetition,
  getPreparationTimeline
} = require('../controllers/competitionController');

const {
  validateCompetition,
  validatePlannedAttempts,
  validateResults,
  validateTravel,
  validateReflection,
  validateTeam,
  validateGear
} = require('../middleware/competitionValidation');

const { protect, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// ======================
// BASIC COMPETITION CRUD
// ======================

router.route('/')
  .get(getCompetitions)
  .post(requireSubscription, validateCompetition, createCompetition);

router.route('/:id')
  .get(getCompetition)
  .put(requireSubscription, validateCompetition, updateCompetition)
  .delete(requireSubscription, deleteCompetition);

// ======================
// COMPETITION OVERVIEW ENDPOINTS
// ======================

router.get('/upcoming', getUpcomingCompetitions);
router.get('/history', getCompetitionHistory);
router.get('/stats', getCompetitionStats);

// ======================
// COMPETITION PLANNING ENDPOINTS
// ======================

// Attempt planning
router.get('/:id/suggest-attempts', getSuggestedAttempts);
router.put('/:id/attempts', requireSubscription, validatePlannedAttempts, updatePlannedAttempts);

// Preparation timeline
router.get('/:id/timeline', getPreparationTimeline);

// ======================
// COMPETITION RESULTS ENDPOINTS
// ======================

// Record competition results
router.put('/:id/results', requireSubscription, validateResults, recordResults);

// Complete competition with reflection
router.post('/:id/complete', requireSubscription, validateReflection, completeCompetition);

// ======================
// COMPETITION DETAILS ENDPOINTS
// ======================

// Travel information
router.put('/:id/travel', requireSubscription, validateTravel, (req, res, next) => {
  req.body = { travel: req.body };
  next();
}, updateCompetition);

// Team and support
router.put('/:id/team', requireSubscription, validateTeam, (req, res, next) => {
  req.body = { team: req.body };
  next();
}, updateCompetition);

// Gear and equipment
router.put('/:id/gear', requireSubscription, validateGear, (req, res, next) => {
  req.body = { gear: req.body };
  next();
}, updateCompetition);

// Strategy and notes
router.put('/:id/strategy', requireSubscription, [
  require('express-validator').body('strategy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Strategy must be less than 1000 characters'),
  
  require('express-validator').body('mentalPrep')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mental prep must be less than 1000 characters'),
  
  require('express-validator').body('nutritionPlan')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Nutrition plan must be less than 1000 characters'),
  
  require('express-validator').body('warmupPlan')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Warmup plan must be less than 1000 characters'),
  
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
], updateCompetition);

module.exports = router;