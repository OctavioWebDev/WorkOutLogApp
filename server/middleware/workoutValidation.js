// middleware/workoutValidation.js
const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Workout validation
exports.validateWorkout = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  
  body('workoutType')
    .optional()
    .isIn(['training', 'rest'])
    .withMessage('Workout type must be training or rest'),
  
  body('weekNumber')
    .optional()
    .isInt({ min: 1, max: 52 })
    .withMessage('Week number must be between 1 and 52'),
  
  body('daysToMeet')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Days to meet must be a positive number'),
  
  body('mainLifts')
    .optional()
    .isArray()
    .withMessage('Main lifts must be an array'),
  
  body('mainLifts.*.exercise')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),
  
  body('mainLifts.*.sets')
    .optional()
    .isArray()
    .withMessage('Sets must be an array'),
  
  body('mainLifts.*.sets.*.reps')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Reps must be between 0 and 100'),
  
  body('mainLifts.*.sets.*.weight')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Weight must be between 0 and 2000'),
  
  body('mainLifts.*.sets.*.rpe')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('RPE must be between 1 and 10'),
  
  body('accessories')
    .optional()
    .isArray()
    .withMessage('Accessories must be an array'),
  
  body('accessories.*.exercise')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),
  
  body('sleepHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  
  body('stressLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10'),
  
  body('bodyWeight')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Body weight must be between 50 and 500'),
  
  body('workoutDuration')
    .optional()
    .isInt({ min: 1, max: 600 })
    .withMessage('Workout duration must be between 1 and 600 minutes'),
  
  body('dailyNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Daily notes must be less than 1000 characters'),
  
  handleValidationErrors
];

// Weekly overview validation
exports.validateWeeklyOverview = [
  body('weekStartDate')
    .optional()
    .isISO8601()
    .withMessage('Week start date must be a valid ISO date'),
  
  body('weekNumber')
    .optional()
    .isInt({ min: 1, max: 52 })
    .withMessage('Week number must be between 1 and 52'),
  
  body('meetPrepPhase')
    .optional()
    .isIn(['Off-Season', 'Base Building', 'Strength', 'Intensity', 'Peak', 'Competition', 'Recovery'])
    .withMessage('Invalid meet prep phase'),
  
  body('daysToMeet')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Days to meet must be a positive number'),
  
  body('weeklyGoals')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Weekly goals must be less than 500 characters'),
  
  body('mainLiftFocus')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Main lift focus must be less than 300 characters'),
  
  body('programNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Program notes must be less than 500 characters'),
  
  body('weekSummary')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Week summary must be less than 1000 characters'),
  
  body('bodyWeightStart')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Body weight start must be between 50 and 500'),
  
  body('bodyWeightEnd')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Body weight end must be between 50 and 500'),
  
  body('objectives')
    .optional()
    .isArray()
    .withMessage('Objectives must be an array'),
  
  body('objectives.*.description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Objective description must be between 1 and 200 characters'),
  
  body('objectives.*.targetValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Target value must be a positive number'),
  
  body('reflection.energyLevels')
    .optional()
    .isIn(['Very Low', 'Low', 'Moderate', 'High', 'Very High'])
    .withMessage('Invalid energy level'),
  
  body('reflection.motivationLevel')
    .optional()
    .isIn(['Very Low', 'Low', 'Moderate', 'High', 'Very High'])
    .withMessage('Invalid motivation level'),
  
  body('reflection.recoveryQuality')
    .optional()
    .isIn(['Poor', 'Fair', 'Good', 'Excellent'])
    .withMessage('Invalid recovery quality'),
  
  body('reflection.overallSatisfaction')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Overall satisfaction must be between 1 and 10'),
  
  handleValidationErrors
];

// Personal record validation
exports.validatePR = [
  body('lift')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Lift name must be between 1 and 100 characters'),
  
  body('weight')
    .isFloat({ min: 1, max: 2000 })
    .withMessage('Weight must be between 1 and 2000'),
  
  body('reps')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Reps must be between 1 and 50'),
  
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  
  body('context')
    .isIn(['training', 'competition'])
    .withMessage('Context must be training or competition'),
  
  body('rpe')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('RPE must be between 1 and 10'),
  
  body('bodyWeight')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Body weight must be between 50 and 500'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  
  handleValidationErrors
];

// Set validation (for individual sets within workouts)
exports.validateSet = [
  body('setNumber')
    .isInt({ min: 1, max: 20 })
    .withMessage('Set number must be between 1 and 20'),
  
  body('reps')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Reps must be between 0 and 100'),
  
  body('weight')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Weight must be between 0 and 2000'),
  
  body('rpe')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('RPE must be between 1 and 10'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Set notes must be less than 200 characters'),
  
  handleValidationErrors
];

// Objective validation (for weekly objectives)
exports.validateObjective = [
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Objective description must be between 1 and 200 characters'),
  
  body('targetValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Target value must be a positive number'),
  
  body('actualValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Actual value must be a positive number'),
  
  body('unit')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit must be less than 20 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Objective notes must be less than 300 characters'),
  
  handleValidationErrors
];