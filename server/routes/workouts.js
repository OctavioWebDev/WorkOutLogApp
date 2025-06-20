// routes/workouts.js
const express = require('express');
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutByDate,
  getWorkoutStats,
  copyWorkout
} = require('../controllers/workoutController');

const {
  getWeeklyOverviews,
  getWeeklyOverview,
  getWeeklyOverviewByDate,
  updateWeeklyOverview,
  addObjective,
  updateObjective,
  deleteObjective,
  getWeeklyTrends,
  completeWeeklyOverview
} = require('../controllers/weeklyController');

const {
  getPersonalRecords,
  getCurrentPRs,
  getBestTotal,
  getPRHistory,
  createPersonalRecord,
  updatePersonalRecord,
  deletePersonalRecord,
  getPRTrends,
  getPRStats,
  getRecentPRs,
  verifyPersonalRecord
} = require('../controllers/prController');

const { protect, requireSubscription } = require('../middleware/auth');
const { validateWorkout, validateWeeklyOverview, validatePR } = require('../middleware/workoutValidation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// ======================
// WORKOUT ROUTES
// ======================

// Basic CRUD operations
router.route('/')
  .get(getWorkouts)
  .post(requireSubscription, validateWorkout, createWorkout);

router.route('/:id')
  .get(getWorkout)
  .put(requireSubscription, validateWorkout, updateWorkout)
  .delete(requireSubscription, deleteWorkout);

// Special workout endpoints
router.get('/date/:date', getWorkoutByDate);
router.get('/stats', getWorkoutStats);
router.post('/:id/copy', requireSubscription, copyWorkout);

// ======================
// WEEKLY OVERVIEW ROUTES
// ======================

router.route('/weekly')
  .get(getWeeklyOverviews);

router.route('/weekly/:id')
  .get(getWeeklyOverview)
  .put(requireSubscription, validateWeeklyOverview, updateWeeklyOverview);

router.get('/weekly/date/:date', getWeeklyOverviewByDate);
router.get('/weekly/trends', getWeeklyTrends);
router.post('/weekly/:id/complete', requireSubscription, completeWeeklyOverview);

// Weekly objectives
router.post('/weekly/:id/objectives', requireSubscription, addObjective);
router.put('/weekly/:id/objectives/:objectiveId', requireSubscription, updateObjective);
router.delete('/weekly/:id/objectives/:objectiveId', requireSubscription, deleteObjective);

// ======================
// PERSONAL RECORDS ROUTES
// ======================

router.route('/prs')
  .get(getPersonalRecords)
  .post(requireSubscription, validatePR, createPersonalRecord);

router.route('/prs/:id')
  .put(requireSubscription, validatePR, updatePersonalRecord)
  .delete(requireSubscription, deletePersonalRecord);

// PR special endpoints
router.get('/prs/current', getCurrentPRs);
router.get('/prs/best-total', getBestTotal);
router.get('/prs/recent', getRecentPRs);
router.get('/prs/stats', getPRStats);
router.get('/prs/history/:lift', getPRHistory);
router.get('/prs/trends/:lift', getPRTrends);
router.post('/prs/:id/verify', requireSubscription, verifyPersonalRecord);

module.exports = router;