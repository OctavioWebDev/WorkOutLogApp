// middleware/competitionValidation.js
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

// Competition creation/update validation
exports.validateCompetition = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Competition name must be between 1 and 200 characters'),
  
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO date')
    .custom((value) => {
      const competitionDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (competitionDate < today) {
        throw new Error('Competition date cannot be in the past');
      }
      return true;
    }),
  
  body('federation')
    .isIn(['USAPL', 'IPF', 'USPA', 'IPL', 'RPS', 'SPF', 'WPC', 'CPU', 'Other'])
    .withMessage('Invalid federation'),
  
  body('competitionType')
    .optional()
    .isIn(['Local', 'Regional', 'National', 'International', 'Online', 'Mock'])
    .withMessage('Invalid competition type'),
  
  body('priorityLevel')
    .optional()
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Priority level must be High, Medium, or Low'),
  
  body('goalTotal')
    .optional()
    .isFloat({ min: 0, max: 3000 })
    .withMessage('Goal total must be between 0 and 3000'),
  
  body('prepWeeks')
    .optional()
    .isInt({ min: 4, max: 20 })
    .withMessage('Prep weeks must be between 4 and 20'),
  
  body('registrationStatus')
    .optional()
    .isIn(['Planning', 'Registered', 'Confirmed', 'Cancelled', 'Completed'])
    .withMessage('Invalid registration status'),
  
  body('entryFee')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Entry fee must be between 0 and 1000'),
  
  body('weightClass')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Weight class must be less than 20 characters'),
  
  body('location.venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Venue name must be less than 200 characters'),
  
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be less than 100 characters'),
  
  body('location.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State must be less than 50 characters'),
  
  handleValidationErrors
];

// Planned attempts validation
exports.validatePlannedAttempts = [
  // Squat attempts
  body('squat.opener.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Squat opener must be between 50 and 1500'),
  
  body('squat.second.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Squat second must be between 50 and 1500'),
  
  body('squat.third.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Squat third must be between 50 and 1500'),
  
  // Bench attempts
  body('bench.opener.weight')
    .optional()
    .isFloat({ min: 30, max: 1000 })
    .withMessage('Bench opener must be between 30 and 1000'),
  
  body('bench.second.weight')
    .optional()
    .isFloat({ min: 30, max: 1000 })
    .withMessage('Bench second must be between 30 and 1000'),
  
  body('bench.third.weight')
    .optional()
    .isFloat({ min: 30, max: 1000 })
    .withMessage('Bench third must be between 30 and 1000'),
  
  // Deadlift attempts
  body('deadlift.opener.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Deadlift opener must be between 50 and 1500'),
  
  body('deadlift.second.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Deadlift second must be between 50 and 1500'),
  
  body('deadlift.third.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Deadlift third must be between 50 and 1500'),
  
  // Percentage validation
  body('squat.opener.percentage')
    .optional()
    .isFloat({ min: 70, max: 100 })
    .withMessage('Opener percentage should be between 70% and 100%'),
  
  body('squat.second.percentage')
    .optional()
    .isFloat({ min: 90, max: 110 })
    .withMessage('Second attempt percentage should be between 90% and 110%'),
  
  body('squat.third.percentage')
    .optional()
    .isFloat({ min: 100, max: 120 })
    .withMessage('Third attempt percentage should be between 100% and 120%'),
  
  handleValidationErrors
];

// Competition results validation
exports.validateResults = [
  body('actualBodyWeight')
    .optional()
    .isFloat({ min: 40, max: 400 })
    .withMessage('Body weight must be between 40 and 400'),
  
  body('flightNumber')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Flight number must be between 1 and 20'),
  
  body('weighInTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Weigh-in time must be in HH:MM format'),
  
  // Squat results
  body('squat.opener.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Squat opener weight must be between 50 and 1500'),
  
  body('squat.opener.made')
    .optional()
    .isBoolean()
    .withMessage('Squat opener made must be true or false'),
  
  body('squat.opener.attempts')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('Squat opener attempts must be between 1 and 3'),
  
  body('squat.opener.rpe')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('RPE must be between 1 and 10'),
  
  // Bench results (similar structure)
  body('bench.opener.weight')
    .optional()
    .isFloat({ min: 30, max: 1000 })
    .withMessage('Bench opener weight must be between 30 and 1000'),
  
  body('bench.opener.made')
    .optional()
    .isBoolean()
    .withMessage('Bench opener made must be true or false'),
  
  // Deadlift results (similar structure)
  body('deadlift.opener.weight')
    .optional()
    .isFloat({ min: 50, max: 1500 })
    .withMessage('Deadlift opener weight must be between 50 and 1500'),
  
  body('deadlift.opener.made')
    .optional()
    .isBoolean()
    .withMessage('Deadlift opener made must be true or false'),
  
  // Final results
  body('placement')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Placement must be between 1 and 1000'),
  
  body('totalLifters')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Total lifters must be between 1 and 1000'),
  
  body('wilksScore')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Wilks score must be between 0 and 1000'),
  
  body('dotsScore')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('DOTS score must be between 0 and 1000'),
  
  handleValidationErrors
];

// Travel information validation
exports.validateTravel = [
  body('hotelName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Hotel name must be less than 200 characters'),
  
  body('checkInDate')
    .optional()
    .isISO8601()
    .withMessage('Check-in date must be a valid ISO date'),
  
  body('checkOutDate')
    .optional()
    .isISO8601()
    .withMessage('Check-out date must be a valid ISO date'),
  
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Estimated cost must be between 0 and 10000'),
  
  body('actualCost')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Actual cost must be between 0 and 10000'),
  
  body('transportationNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Transportation notes must be less than 500 characters'),
  
  handleValidationErrors
];

// Competition reflection validation
exports.validateReflection = [
  body('overallSatisfaction')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Overall satisfaction must be between 1 and 10'),
  
  body('whatWorkedWell')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('What worked well must be less than 1000 characters'),
  
  body('areasForImprovement')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Areas for improvement must be less than 1000 characters'),
  
  body('lessonsLearned')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Lessons learned must be less than 1000 characters'),
  
  body('nextCompetitionGoals')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Next competition goals must be less than 500 characters'),
  
  body('wouldCompeteAgain')
    .optional()
    .isBoolean()
    .withMessage('Would compete again must be true or false'),
  
  handleValidationErrors
];

// Team and support validation
exports.validateTeam = [
  body('coach')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Coach name must be less than 100 characters'),
  
  body('handler')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Handler name must be less than 100 characters'),
  
  body('teammates')
    .optional()
    .isArray()
    .withMessage('Teammates must be an array'),
  
  body('teammates.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Teammate name must be less than 100 characters'),
  
  body('supporters')
    .optional()
    .isArray()
    .withMessage('Supporters must be an array'),
  
  body('supporters.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Supporter name must be less than 100 characters'),
  
  handleValidationErrors
];

// Gear validation
exports.validateGear = [
  body('singlet')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Singlet details must be less than 100 characters'),
  
  body('shoes')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Shoes details must be less than 100 characters'),
  
  body('belt')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Belt details must be less than 100 characters'),
  
  body('wraps')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Wraps details must be less than 100 characters'),
  
  body('sleeves')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Sleeves details must be less than 100 characters'),
  
  body('other')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Other gear details must be less than 200 characters'),
  
  body('backupGear')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Backup gear details must be less than 200 characters'),
  
  handleValidationErrors
];