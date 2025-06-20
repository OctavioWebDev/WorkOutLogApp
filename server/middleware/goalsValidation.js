// middleware/goalsValidation.js
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

// Annual goals validation
exports.validateAnnualGoals = [
  body('year')
    .isInt({ min: 2020, max: 2035 })
    .withMessage('Year must be between 2020 and 2035'),
  
  // Strength goals validation
  body('goals.squat.target')
    .optional()
    .isFloat({ min: 50, max: 2000 })
    .withMessage('Squat target must be between 50 and 2000 lbs'),
  
  body('goals.bench.target')
    .optional()
    .isFloat({ min: 30, max: 1500 })
    .withMessage('Bench target must be between 30 and 1500 lbs'),
  
  body('goals.deadlift.target')
    .optional()
    .isFloat({ min: 50, max: 2000 })
    .withMessage('Deadlift target must be between 50 and 2000 lbs'),
  
  body('goals.total.target')
    .optional()
    .isFloat({ min: 200, max: 4000 })
    .withMessage('Total target must be between 200 and 4000 lbs'),
  
  // Target dates validation
  body('goals.squat.targetDate')
    .optional()
    .isISO8601()
    .withMessage('Squat target date must be a valid ISO date'),
  
  body('goals.bench.targetDate')
    .optional()
    .isISO8601()
    .withMessage('Bench target date must be a valid ISO date'),
  
  body('goals.deadlift.targetDate')
    .optional()
    .isISO8601()
    .withMessage('Deadlift target date must be a valid ISO date'),
  
  // Priority validation
  body('goals.squat.priority')
    .optional()
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Priority must be High, Medium, or Low'),
  
  // Competition goals validation
  body('competitionGoals.targetCompetitions')
    .optional()
    .isInt({ min: 0, max: 12 })
    .withMessage('Target competitions must be between 0 and 12'),
  
  body('competitionGoals.plannedCompetitions')
    .optional()
    .isArray()
    .withMessage('Planned competitions must be an array'),
  
  body('competitionGoals.plannedCompetitions.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Competition name must be between 1 and 200 characters'),
  
  body('competitionGoals.plannedCompetitions.*.date')
    .optional()
    .isISO8601()
    .withMessage('Competition date must be a valid ISO date'),
  
  body('competitionGoals.plannedCompetitions.*.priority')
    .optional()
    .isIn(['A', 'B', 'C'])
    .withMessage('Competition priority must be A, B, or C'),
  
  // Training goals validation
  body('trainingGoals.consistencyTarget.target')
    .optional()
    .isInt({ min: 1, max: 7 })
    .withMessage('Training consistency target must be between 1 and 7 days per week'),
  
  body('trainingGoals.volumeGoals.weeklyVolume')
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Weekly volume must be between 0 and 100,000'),
  
  body('trainingGoals.techniqueGoals')
    .optional()
    .isArray()
    .withMessage('Technique goals must be an array'),
  
  body('trainingGoals.techniqueGoals.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each technique goal must be less than 200 characters'),
  
  body('trainingGoals.programPreference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Program preference must be less than 100 characters'),
  
  // Body composition goals validation
  body('bodyCompositionGoals.targetWeight')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Target weight must be between 50 and 500 lbs'),
  
  body('bodyCompositionGoals.competitionWeight')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Competition weight must be between 50 and 500 lbs'),
  
  body('bodyCompositionGoals.targetBodyFat')
    .optional()
    .isFloat({ min: 3, max: 50 })
    .withMessage('Target body fat must be between 3% and 50%'),
  
  // Financial goals validation
  body('financialGoals.competitionBudget')
    .optional()
    .isFloat({ min: 0, max: 50000 })
    .withMessage('Competition budget must be between 0 and 50,000'),
  
  body('financialGoals.totalPowerliftingBudget')
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Total powerlifting budget must be between 0 and 100,000'),
  
  // Status validation
  body('status')
    .optional()
    .isIn(['Planning', 'Active', 'Review', 'Completed', 'Abandoned'])
    .withMessage('Status must be Planning, Active, Review, Completed, or Abandoned'),
  
  handleValidationErrors
];

// Monthly check-in validation
exports.validateMonthlyCheckin = [
  body('squat')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Squat must be between 0 and 2000 lbs'),
  
  body('bench')
    .optional()
    .isFloat({ min: 0, max: 1500 })
    .withMessage('Bench must be between 0 and 1500 lbs'),
  
  body('deadlift')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Deadlift must be between 0 and 2000 lbs'),
  
  body('bodyWeight')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Body weight must be between 50 and 500 lbs'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  
  body('onTrack')
    .optional()
    .isBoolean()
    .withMessage('On track must be true or false'),
  
  body('adjustments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Adjustments must be less than 500 characters'),
  
  handleValidationErrors
];

// Quarterly milestone completion validation
exports.validateQuarterlyCompletion = [
  body('actualResults.squat')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Squat result must be between 0 and 2000 lbs'),
  
  body('actualResults.bench')
    .optional()
    .isFloat({ min: 0, max: 1500 })
    .withMessage('Bench result must be between 0 and 1500 lbs'),
  
  body('actualResults.deadlift')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Deadlift result must be between 0 and 2000 lbs'),
  
  body('actualResults.total')
    .optional()
    .isFloat({ min: 0, max: 4000 })
    .withMessage('Total result must be between 0 and 4000 lbs'),
  
  body('actualResults.bodyWeight')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Body weight must be between 50 and 500 lbs'),
  
  body('reflection')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Reflection must be less than 1000 characters'),
  
  handleValidationErrors
];

// Annual review validation
exports.validateAnnualReview = [
  // Goal achievements validation
  body('goalAchievements.squat.assessment')
    .optional()
    .isIn(['Exceeded', 'Met', 'Close', 'Fell Short', 'Not Attempted'])
    .withMessage('Assessment must be Exceeded, Met, Close, Fell Short, or Not Attempted'),
  
  body('goalAchievements.squat.final')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Final squat must be between 0 and 2000 lbs'),
  
  // Competition review validation
  body('competitionReview.actualCompetitions')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Actual competitions must be between 0 and 20'),
  
  body('competitionReview.competitionResults')
    .optional()
    .isArray()
    .withMessage('Competition results must be an array'),
  
  body('competitionReview.competitionResults.*.total')
    .optional()
    .isFloat({ min: 0, max: 4000 })
    .withMessage('Competition total must be between 0 and 4000 lbs'),
  
  body('competitionReview.competitionResults.*.satisfaction')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Competition satisfaction must be between 1 and 10'),
  
  // Training review validation
  body('trainingReview.totalWorkouts')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('Total workouts must be between 0 and 500'),
  
  body('trainingReview.consistencyScore')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Consistency score must be between 1 and 10'),
  
  body('trainingReview.programsUsed')
    .optional()
    .isArray()
    .withMessage('Programs used must be an array'),
  
  // Health review validation
  body('healthReview.injuryFrequency')
    .optional()
    .isIn(['None', 'Minor', 'Moderate', 'Significant'])
    .withMessage('Injury frequency must be None, Minor, Moderate, or Significant'),
  
  body('healthReview.recoveryQuality')
    .optional()
    .isIn(['Poor', 'Fair', 'Good', 'Excellent'])
    .withMessage('Recovery quality must be Poor, Fair, Good, or Excellent'),
  
  body('healthReview.sleepQuality')
    .optional()
    .isIn(['Poor', 'Fair', 'Good', 'Excellent'])
    .withMessage('Sleep quality must be Poor, Fair, Good, or Excellent'),
  
  // Reflections validation
  body('reflections.biggestWins')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Biggest wins must be less than 2000 characters'),
  
  body('reflections.biggestChallenges')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Biggest challenges must be less than 2000 characters'),
  
  body('reflections.lessonsLearned')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Lessons learned must be less than 2000 characters'),
  
  // Overall assessment validation
  body('overallAssessment.yearSatisfaction')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Year satisfaction must be between 1 and 10'),
  
  body('overallAssessment.goalDifficulty')
    .optional()
    .isIn(['Too Easy', 'Just Right', 'Too Hard'])
    .withMessage('Goal difficulty must be Too Easy, Just Right, or Too Hard'),
  
  body('overallAssessment.effortLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Effort level must be between 1 and 10'),
  
  body('overallAssessment.overallGrade')
    .optional()
    .isIn(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'])
    .withMessage('Overall grade must be a valid letter grade'),
  
  // Next year seeds validation
  body('nextYearSeeds.preliminaryGoals.squat')
    .optional()
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Preliminary squat goal must be between 0 and 2000 lbs'),
  
  body('nextYearSeeds.excitement')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Excitement must be between 1 and 10'),
  
  body('nextYearSeeds.motivation')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Motivation must be between 1 and 10'),
  
  body('nextYearSeeds.confidence')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Confidence must be between 1 and 10'),
  
  handleValidationErrors
];

// Strategy and planning validation
exports.validateStrategy = [
  body('overallStrategy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Overall strategy must be less than 1000 characters'),
  
  body('trainingStrategy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Training strategy must be less than 1000 characters'),
  
  body('competitionStrategy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Competition strategy must be less than 1000 characters'),
  
  body('nutritionStrategy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Nutrition strategy must be less than 1000 characters'),
  
  body('recoveryStrategy')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Recovery strategy must be less than 1000 characters'),
  
  body('peakingPlan')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Peaking plan must be less than 500 characters'),
  
  body('offSeasonPlan')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Off-season plan must be less than 500 characters'),
  
  handleValidationErrors
];

// Motivation and accountability validation
exports.validateMotivation = [
  body('whyTheseGoals')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Why these goals must be less than 1000 characters'),
  
  body('visualizationNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Visualization notes must be less than 1000 characters'),
  
  body('accountabilityPartner')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Accountability partner must be less than 100 characters'),
  
  body('publicCommitments')
    .optional()
    .isArray()
    .withMessage('Public commitments must be an array'),
  
  body('publicCommitments.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each public commitment must be less than 200 characters'),
  
  body('rewards')
    .optional()
    .isArray()
    .withMessage('Rewards must be an array'),
  
  body('rewards.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each reward must be less than 200 characters'),
  
  handleValidationErrors
];