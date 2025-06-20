// models/AnnualReview.js
const mongoose = require('mongoose');

const annualReviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  year: { 
    type: Number, 
    required: true,
    min: 2020,
    max: 2035
  },
  annualGoalsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnnualGoals',
    required: true
  },
  
  // Goal Achievement Summary
  goalAchievements: {
    squat: {
      starting: Number,
      goal: Number,
      final: Number,
      achieved: { type: Boolean, default: false },
      percentageAchieved: Number,
      assessment: { type: String, enum: ['Exceeded', 'Met', 'Close', 'Fell Short', 'Not Attempted'] }
    },
    bench: {
      starting: Number,
      goal: Number,
      final: Number,
      achieved: { type: Boolean, default: false },
      percentageAchieved: Number,
      assessment: { type: String, enum: ['Exceeded', 'Met', 'Close', 'Fell Short', 'Not Attempted'] }
    },
    deadlift: {
      starting: Number,
      goal: Number,
      final: Number,
      achieved: { type: Boolean, default: false },
      percentageAchieved: Number,
      assessment: { type: String, enum: ['Exceeded', 'Met', 'Close', 'Fell Short', 'Not Attempted'] }
    },
    total: {
      starting: Number,
      goal: Number,
      final: Number,
      achieved: { type: Boolean, default: false },
      percentageAchieved: Number,
      assessment: { type: String, enum: ['Exceeded', 'Met', 'Close', 'Fell Short', 'Not Attempted'] }
    }
  },
  
  // Competition Review
  competitionReview: {
    plannedCompetitions: Number,
    actualCompetitions: Number,
    competitionResults: [{
      name: String,
      date: Date,
      total: Number,
      placement: Number,
      successRate: Number,
      prsMade: Number,
      satisfaction: { type: Number, min: 1, max: 10 }
    }],
    bestCompetition: {
      name: String,
      total: Number,
      whyBest: String
    },
    competitionGoalsAchieved: [String],
    competitionGoalsMissed: [String]
  },
  
  // Training Review
  trainingReview: {
    totalWorkouts: Number,
    avgWorkoutsPerWeek: Number,
    consistencyScore: Number, // 1-10
    programsUsed: [String],
    mostEffectiveProgram: String,
    trainingHighlights: [String],
    trainingChallenges: [String],
    volumeProgression: {
      startingVolume: Number,
      peakVolume: Number,
      endingVolume: Number
    }
  },
  
  // Personal Records Review
  prReview: {
    totalPRs: Number,
    squatPRs: Number,
    benchPRs: Number,
    deadliftPRs: Number,
    biggestPR: {
      lift: String,
      weight: Number,
      date: Date,
      context: String
    },
    prFrequency: String, // e.g., "Every 6 weeks on average"
    prTrends: String
  },
  
  // Health & Wellness Review
  healthReview: {
    injuryFrequency: { type: String, enum: ['None', 'Minor', 'Moderate', 'Significant'] },
    injuryDetails: [String],
    recoveryQuality: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] },
    sleepQuality: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] },
    stressManagement: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] },
    nutritionAdherence: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] },
    bodyCompositionChanges: String,
    healthGoalsAchieved: [String]
  },
  
  // Reflections
  reflections: {
    biggestWins: String,
    biggestChallenges: String,
    lessonsLearned: String,
    unexpectedOutcomes: String,
    mindsetEvolution: String,
    supportSystemReview: String,
    
    // What worked/didn't work
    whatWorkedWell: String,
    whatDidntWork: String,
    wouldDoEverythingAgain: { type: Boolean },
    biggestRegret: String,
    proudestMoment: String
  },
  
  // Ratings & Assessments
  overallAssessment: {
    yearSatisfaction: { type: Number, min: 1, max: 10 },
    goalDifficulty: { type: String, enum: ['Too Easy', 'Just Right', 'Too Hard'] },
    effortLevel: { type: Number, min: 1, max: 10 },
    consistencyRating: { type: Number, min: 1, max: 10 },
    adaptabilityRating: { type: Number, min: 1, max: 10 },
    overallGrade: { type: String, enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'] }
  },
  
  // Quantitative Analysis
  quantitativeAnalysis: {
    totalStrengthGained: Number, // Sum of all lift improvements
    strengthGainRate: Number, // lbs per month
    trainingEfficiency: Number, // Strength gained per workout
    competitionEffectiveness: Number, // PRs in competition vs training
    
    // Comparisons
    vsLastYear: {
      strengthImprovement: Number,
      competitionImprovement: Number,
      consistencyImprovement: Number
    },
    
    // Projections
    projectedNextYear: {
      estimatedSquat: Number,
      estimatedBench: Number,
      estimatedDeadlift: Number,
      estimatedTotal: Number,
      confidence: { type: String, enum: ['Low', 'Medium', 'High'] }
    }
  },
  
  // Next Year Planning Seeds
  nextYearSeeds: {
    carryOverGoals: [String], // Goals to continue working on
    newFocusAreas: [String], // New areas to focus on
    lessonsToApply: [String], // Specific lessons to implement
    
    // Preliminary next year thoughts
    preliminaryGoals: {
      squat: Number,
      bench: Number,
      deadlift: Number,
      total: Number
    },
    
    strategicChanges: [String], // Major changes to make
    priorityShifts: String, // How priorities might change
    
    // Motivation for next year
    excitement: { type: Number, min: 1, max: 10 },
    motivation: { type: Number, min: 1, max: 10 },
    confidence: { type: Number, min: 1, max: 10 }
  },
  
  // External Factors Review
  externalFactors: {
    lifeChanges: [String], // Major life events that affected training
    equipmentChanges: [String],
    coachingChanges: String,
    gymChanges: String,
    financialImpact: String,
    
    // How external factors affected goals
    positiveInfluences: [String],
    negativeInfluences: [String],
    adaptationsRequired: [String]
  },
  
  // Data-Driven Insights
  dataInsights: {
    bestPerformingMonths: [String],
    worstPerformingMonths: [String],
    optimalTrainingFrequency: String,
    bestRecoveryStrategies: [String],
    mostEffectiveExercises: [String],
    
    // Patterns identified
    strengthPatterns: String,
    injuryPatterns: String,
    motivationPatterns: String
  },
  
  // Status
  reviewCompleteness: { type: Number, min: 0, max: 100, default: 0 },
  isCompleted: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// Indexes
annualReviewSchema.index({ userId: 1, year: 1 }, { unique: true });
annualReviewSchema.index({ userId: 1, isCompleted: 1 });

// Update updatedAt on save
annualReviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate review completeness
  this.calculateCompleteness();
  
  // Set completedAt if marking complete
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Method to calculate review completeness
annualReviewSchema.methods.calculateCompleteness = function() {
  let completedSections = 0;
  const totalSections = 8;
  
  // Check goal achievements
  if (this.goalAchievements && 
      this.goalAchievements.squat.assessment && 
      this.goalAchievements.bench.assessment && 
      this.goalAchievements.deadlift.assessment) {
    completedSections++;
  }
  
  // Check competition review
  if (this.competitionReview && this.competitionReview.actualCompetitions !== undefined) {
    completedSections++;
  }
  
  // Check training review
  if (this.trainingReview && this.trainingReview.consistencyScore) {
    completedSections++;
  }
  
  // Check PR review
  if (this.prReview && this.prReview.totalPRs !== undefined) {
    completedSections++;
  }
  
  // Check health review
  if (this.healthReview && this.healthReview.recoveryQuality) {
    completedSections++;
  }
  
  // Check reflections
  if (this.reflections && this.reflections.biggestWins) {
    completedSections++;
  }
  
  // Check overall assessment
  if (this.overallAssessment && this.overallAssessment.yearSatisfaction) {
    completedSections++;
  }
  
  // Check next year seeds
  if (this.nextYearSeeds && this.nextYearSeeds.excitement) {
    completedSections++;
  }
  
  this.reviewCompleteness = Math.round((completedSections / totalSections) * 100);
  
  // Auto-complete if all sections done
  if (this.reviewCompleteness === 100 && !this.isCompleted) {
    this.isCompleted = true;
  }
};

// Method to auto-populate from annual goals and data
annualReviewSchema.methods.autoPopulateFromData = async function() {
  const AnnualGoals = mongoose.model('AnnualGoals');
  const Competition = mongoose.model('Competition');
  const PersonalRecord = mongoose.model('PersonalRecord');
  const Workout = mongoose.model('Workout');
  
  // Get annual goals
  const goals = await AnnualGoals.findById(this.annualGoalsId);
  if (!goals) return;
  
  // Populate goal achievements
  this.goalAchievements = {
    squat: this.assessGoalAchievement(goals.goals.squat),
    bench: this.assessGoalAchievement(goals.goals.bench),
    deadlift: this.assessGoalAchievement(goals.goals.deadlift),
    total: this.assessGoalAchievement(goals.goals.total)
  };
  
  // Get competition data
  const competitions = await Competition.find({
    userId: this.userId,
    date: {
      $gte: new Date(this.year, 0, 1),
      $lte: new Date(this.year, 11, 31)
    },
    isCompleted: true
  });
  
  this.competitionReview.actualCompetitions = competitions.length;
  this.competitionReview.plannedCompetitions = goals.competitionGoals.targetCompetitions || 0;
  
  // Get PR data
  const prs = await PersonalRecord.find({
    userId: this.userId,
    date: {
      $gte: new Date(this.year, 0, 1),
      $lte: new Date(this.year, 11, 31)
    },
    isActive: true
  });
  
  this.prReview.totalPRs = prs.length;
  this.prReview.squatPRs = prs.filter(pr => pr.lift.toLowerCase().includes('squat')).length;
  this.prReview.benchPRs = prs.filter(pr => pr.lift.toLowerCase().includes('bench')).length;
  this.prReview.deadliftPRs = prs.filter(pr => pr.lift.toLowerCase().includes('deadlift')).length;
  
  // Find biggest PR
  if (prs.length > 0) {
    const biggestPR = prs.reduce((biggest, current) => {
      const currentIncrease = current.weight - (current.previousPR || 0);
      const biggestIncrease = biggest.weight - (biggest.previousPR || 0);
      return currentIncrease > biggestIncrease ? current : biggest;
    });
    
    this.prReview.biggestPR = {
      lift: biggestPR.lift,
      weight: biggestPR.weight,
      date: biggestPR.date,
      context: biggestPR.context
    };
  }
  
  // Get workout data
  const workouts = await Workout.find({
    userId: this.userId,
    date: {
      $gte: new Date(this.year, 0, 1),
      $lte: new Date(this.year, 11, 31)
    },
    isCompleted: true
  });
  
  this.trainingReview.totalWorkouts = workouts.length;
  this.trainingReview.avgWorkoutsPerWeek = Math.round((workouts.length / 52) * 10) / 10;
  
  await this.save();
};

// Method to assess goal achievement
annualReviewSchema.methods.assessGoalAchievement = function(goalData) {
  if (!goalData || !goalData.target || !goalData.startingMax) {
    return {
      starting: 0,
      goal: 0,
      final: 0,
      achieved: false,
      percentageAchieved: 0,
      assessment: 'Not Attempted'
    };
  }
  
  const starting = goalData.startingMax;
  const goal = goalData.target;
  const final = goalData.current || starting;
  
  const targetProgress = goal - starting;
  const actualProgress = final - starting;
  const percentageAchieved = targetProgress > 0 ? 
    Math.round((actualProgress / targetProgress) * 100) : 0;
  
  let assessment;
  if (percentageAchieved >= 100) {
    assessment = final > goal ? 'Exceeded' : 'Met';
  } else if (percentageAchieved >= 90) {
    assessment = 'Close';
  } else if (percentageAchieved > 0) {
    assessment = 'Fell Short';
  } else {
    assessment = 'Not Attempted';
  }
  
  return {
    starting,
    goal,
    final,
    achieved: percentageAchieved >= 100,
    percentageAchieved,
    assessment
  };
};

// Static method to get review insights across years
annualReviewSchema.statics.getMultiYearInsights = async function(userId) {
  const reviews = await this.find({
    userId: userId,
    isCompleted: true
  }).sort({ year: 1 });
  
  if (reviews.length < 2) return null;
  
  const insights = {
    yearCount: reviews.length,
    averageSatisfaction: 0,
    strengthProgressTrend: 'stable',
    consistencyTrend: 'stable',
    competitionTrend: 'stable',
    strongestAreas: [],
    improvementAreas: [],
    patterns: []
  };
  
  // Calculate averages
  let totalSatisfaction = 0;
  let totalStrengthGain = 0;
  let totalConsistency = 0;
  let totalCompetitions = 0;
  
  reviews.forEach(review => {
    totalSatisfaction += review.overallAssessment.yearSatisfaction || 0;
    totalStrengthGain += review.quantitativeAnalysis.totalStrengthGained || 0;
    totalConsistency += review.overallAssessment.consistencyRating || 0;
    totalCompetitions += review.competitionReview.actualCompetitions || 0;
  });
  
  insights.averageSatisfaction = Math.round((totalSatisfaction / reviews.length) * 10) / 10;
  
  // Analyze trends
  const firstHalf = reviews.slice(0, Math.floor(reviews.length / 2));
  const secondHalf = reviews.slice(Math.floor(reviews.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, r) => sum + (r.quantitativeAnalysis.totalStrengthGained || 0), 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, r) => sum + (r.quantitativeAnalysis.totalStrengthGained || 0), 0) / secondHalf.length;
  
  if (secondHalfAvg > firstHalfAvg * 1.1) {
    insights.strengthProgressTrend = 'improving';
  } else if (secondHalfAvg < firstHalfAvg * 0.9) {
    insights.strengthProgressTrend = 'declining';
  }
  
  return insights;
};

// Static method to generate review template
annualReviewSchema.statics.generateReviewTemplate = async function(userId, year, annualGoalsId) {
  const existingReview = await this.findOne({ userId, year });
  if (existingReview) return existingReview;
  
  const review = new this({
    userId,
    year,
    annualGoalsId,
    goalAchievements: {
      squat: { assessment: 'Not Attempted' },
      bench: { assessment: 'Not Attempted' },
      deadlift: { assessment: 'Not Attempted' },
      total: { assessment: 'Not Attempted' }
    },
    competitionReview: {},
    trainingReview: {},
    prReview: {},
    healthReview: {},
    reflections: {},
    overallAssessment: {},
    quantitativeAnalysis: {},
    nextYearSeeds: {},
    externalFactors: {},
    dataInsights: {}
  });
  
  await review.autoPopulateFromData();
  return review;
};

// Ensure virtual fields are serialized
annualReviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AnnualReview', annualReviewSchema);