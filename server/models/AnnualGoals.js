// models/AnnualGoals.js
const mongoose = require('mongoose');

const annualGoalsSchema = new mongoose.Schema({
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
  
  // Strength Goals
  goals: {
    squat: { 
      target: Number,
      current: Number,
      startingMax: Number,
      targetDate: Date,
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
    },
    bench: { 
      target: Number,
      current: Number,
      startingMax: Number,
      targetDate: Date,
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
    },
    deadlift: { 
      target: Number,
      current: Number,
      startingMax: Number,
      targetDate: Date,
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
    },
    total: { 
      target: Number,
      current: Number,
      startingTotal: Number,
      targetDate: Date,
      priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
    }
  },
  
  // Competition Goals
  competitionGoals: {
    targetCompetitions: Number,
    plannedCompetitions: [{
      name: String,
      date: Date,
      federation: String,
      priority: { type: String, enum: ['A', 'B', 'C'] }, // A = Most Important
      goalTotal: Number,
      status: { type: String, enum: ['Planned', 'Registered', 'Completed', 'Cancelled'], default: 'Planned' }
    }],
    qualificationGoals: [String], // e.g., "Qualify for Nationals", "IPF Worlds Team"
    placementGoals: String, // e.g., "Top 3 at State", "Win my weight class"
  },
  
  // Training Goals
  trainingGoals: {
    consistencyTarget: { // Training days per week
      target: Number,
      current: Number,
      unit: 'days per week'
    },
    volumeGoals: {
      weeklyVolume: Number, // Target weekly volume
      peakVolume: Number // Peak volume during base phase
    },
    techniqueGoals: [String], // e.g., ["Improve squat depth", "Fix bench bar path"]
    weakPointFocus: [String], // e.g., ["Lockout strength", "Speed off chest"]
    programPreference: String // e.g., "Conjugate", "Linear", "DUP"
  },
  
  // Body Composition Goals
  bodyCompositionGoals: {
    targetWeight: Number,
    startingWeight: Number,
    currentWeight: Number,
    targetBodyFat: Number,
    competitionWeight: Number,
    weightClass: String,
    timeline: String // e.g., "Cut 10lbs by March, maintain through summer"
  },
  
  // Quarterly Milestones
  quarterlyMilestones: [{
    quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], required: true },
    goals: {
      squat: Number,
      bench: Number,
      deadlift: Number,
      total: Number,
      bodyWeight: Number
    },
    focus: String, // e.g., "Volume accumulation", "Competition prep"
    competitions: [String], // Competition names for this quarter
    trainingCycle: String, // e.g., "Hypertrophy", "Strength", "Peak"
    isCompleted: { type: Boolean, default: false },
    actualResults: {
      squat: Number,
      bench: Number,
      deadlift: Number,
      total: Number,
      bodyWeight: Number,
      completedAt: Date
    },
    reflection: String
  }],
  
  // Personal Development Goals
  personalGoals: {
    mentalPerformance: [String], // e.g., ["Improve competition nerves", "Better focus"]
    lifestyle: [String], // e.g., ["Better sleep schedule", "Stress management"]
    knowledge: [String], // e.g., ["Learn conjugate method", "Nutrition certification"]
    coaching: String, // Goals related to coaching/helping others
    community: String // Goals related to powerlifting community involvement
  },
  
  // Injury Prevention & Health
  healthGoals: {
    mobilityGoals: [String],
    injuryPrevention: [String],
    recoveryGoals: [String],
    healthMetrics: {
      sleepTarget: Number, // hours per night
      stressManagement: String,
      nutritionGoals: [String]
    }
  },
  
  // Financial Goals (related to powerlifting)
  financialGoals: {
    competitionBudget: Number,
    equipmentBudget: Number,
    coachingBudget: Number,
    travelBudget: Number,
    totalPowerliftingBudget: Number,
    sponsorshipGoals: String
  },
  
  // Progress Tracking
  progress: {
    monthlyCheckins: [{
      month: { type: Number, min: 1, max: 12 },
      squat: Number,
      bench: Number,
      deadlift: Number,
      bodyWeight: Number,
      notes: String,
      onTrack: { type: Boolean, default: true },
      adjustments: String,
      recordedAt: { type: Date, default: Date.now }
    }],
    
    // Auto-calculated progress metrics
    progressMetrics: {
      squatProgress: Number, // lbs gained
      benchProgress: Number,
      deadliftProgress: Number,
      totalProgress: Number,
      
      // Percentage completion
      squatPercentComplete: Number,
      benchPercentComplete: Number,
      deadliftPercentComplete: Number,
      totalPercentComplete: Number,
      
      // Goal difficulty assessment
      squatGoalDifficulty: { type: String, enum: ['Conservative', 'Realistic', 'Aggressive', 'Unrealistic'] },
      benchGoalDifficulty: { type: String, enum: ['Conservative', 'Realistic', 'Aggressive', 'Unrealistic'] },
      deadliftGoalDifficulty: { type: String, enum: ['Conservative', 'Realistic', 'Aggressive', 'Unrealistic'] }
    }
  },
  
  // Strategy & Planning
  strategy: {
    overallStrategy: String, // Main focus for the year
    trainingStrategy: String, // Training approach
    competitionStrategy: String, // Competition approach
    nutritionStrategy: String,
    recoveryStrategy: String,
    
    // Timeline planning
    peakingPlan: String, // When to peak
    offSeasonPlan: String, // Off-season goals
    
    // Risk management
    backupPlans: String,
    injuryContingency: String
  },
  
  // Motivation & Accountability
  motivation: {
    whyTheseGoals: String, // Deep motivation
    visualizationNotes: String,
    accountabilityPartner: String,
    publicCommitments: [String],
    rewards: [String], // Rewards for achieving goals
    consequences: [String] // Consequences for not achieving goals
  },
  
  // Status and Meta
  status: {
    type: String,
    enum: ['Planning', 'Active', 'Review', 'Completed', 'Abandoned'],
    default: 'Planning'
  },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// Indexes
annualGoalsSchema.index({ userId: 1, year: 1 }, { unique: true });
annualGoalsSchema.index({ userId: 1, status: 1 });
annualGoalsSchema.index({ year: 1 });

// Update updatedAt on save
annualGoalsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate progress metrics
  this.calculateProgressMetrics();
  
  // Set completedAt if marking complete
  if (this.status === 'Completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Virtual for overall progress percentage
annualGoalsSchema.virtual('overallProgress').get(function() {
  if (!this.progress.progressMetrics) return 0;
  
  const metrics = this.progress.progressMetrics;
  const avg = (
    metrics.squatPercentComplete + 
    metrics.benchPercentComplete + 
    metrics.deadliftPercentComplete + 
    metrics.totalPercentComplete
  ) / 4;
  
  return Math.round(avg * 10) / 10;
});

// Virtual for days remaining in year
annualGoalsSchema.virtual('daysRemainingInYear').get(function() {
  const now = new Date();
  const endOfYear = new Date(this.year, 11, 31, 23, 59, 59);
  
  if (now > endOfYear) return 0;
  
  const timeDiff = endOfYear.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for current quarter
annualGoalsSchema.virtual('currentQuarter').get(function() {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  if (currentYear !== this.year) {
    return currentYear > this.year ? 'Q4' : 'Q1';
  }
  
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
});

// Method to calculate progress metrics
annualGoalsSchema.methods.calculateProgressMetrics = function() {
  if (!this.progress) this.progress = { progressMetrics: {} };
  if (!this.progress.progressMetrics) this.progress.progressMetrics = {};
  
  const metrics = this.progress.progressMetrics;
  
  // Calculate progress for each lift
  ['squat', 'bench', 'deadlift', 'total'].forEach(lift => {
    const goal = this.goals[lift];
    if (!goal || !goal.target || !goal.startingMax) return;
    
    const current = goal.current || goal.startingMax;
    const progress = current - goal.startingMax;
    const totalNeeded = goal.target - goal.startingMax;
    
    metrics[`${lift}Progress`] = Math.round(progress * 10) / 10;
    metrics[`${lift}PercentComplete`] = totalNeeded > 0 ? 
      Math.round((progress / totalNeeded) * 100 * 10) / 10 : 0;
    
    // Assess goal difficulty
    const percentIncrease = (totalNeeded / goal.startingMax) * 100;
    
    if (percentIncrease <= 5) {
      metrics[`${lift}GoalDifficulty`] = 'Conservative';
    } else if (percentIncrease <= 10) {
      metrics[`${lift}GoalDifficulty`] = 'Realistic';
    } else if (percentIncrease <= 15) {
      metrics[`${lift}GoalDifficulty`] = 'Aggressive';
    } else {
      metrics[`${lift}GoalDifficulty`] = 'Unrealistic';
    }
  });
};

// Method to update current maxes from latest PRs
annualGoalsSchema.methods.updateCurrentMaxes = async function() {
  const PersonalRecord = mongoose.model('PersonalRecord');
  
  // Get best lifts for this user
  const bestLifts = await PersonalRecord.getBestLifts(this.userId);
  
  // Update current values
  if (bestLifts.squat) this.goals.squat.current = bestLifts.squat.weight;
  if (bestLifts.bench) this.goals.bench.current = bestLifts.bench.weight;
  if (bestLifts.deadlift) this.goals.deadlift.current = bestLifts.deadlift.weight;
  if (bestLifts.total) this.goals.total.current = bestLifts.total;
  
  return this.save();
};

// Method to add monthly check-in
annualGoalsSchema.methods.addMonthlyCheckin = function(checkinData) {
  const month = new Date().getMonth() + 1;
  
  // Remove existing check-in for this month if it exists
  this.progress.monthlyCheckins = this.progress.monthlyCheckins.filter(
    checkin => checkin.month !== month
  );
  
  // Add new check-in
  this.progress.monthlyCheckins.push({
    month: month,
    ...checkinData,
    recordedAt: new Date()
  });
  
  // Sort by month
  this.progress.monthlyCheckins.sort((a, b) => a.month - b.month);
  
  return this.save();
};

// Method to complete quarterly milestone
annualGoalsSchema.methods.completeQuarterlyMilestone = function(quarter, actualResults, reflection) {
  const milestone = this.quarterlyMilestones.find(m => m.quarter === quarter);
  
  if (milestone) {
    milestone.isCompleted = true;
    milestone.actualResults = {
      ...actualResults,
      completedAt: new Date()
    };
    milestone.reflection = reflection;
  }
  
  return this.save();
};

// Static method to get active goals for user
annualGoalsSchema.statics.getActiveGoals = async function(userId, year) {
  const currentYear = year || new Date().getFullYear();
  
  return await this.findOne({
    userId: userId,
    year: currentYear,
    isActive: true
  });
};

// Static method to get goal history
annualGoalsSchema.statics.getGoalHistory = async function(userId, limit = 5) {
  return await this.find({
    userId: userId,
    isActive: true
  })
  .sort({ year: -1 })
  .limit(limit)
  .select('year goals.squat.target goals.bench.target goals.deadlift.target goals.total.target status progress.progressMetrics');
};

// Static method to analyze goal achievement patterns
annualGoalsSchema.statics.getAchievementAnalysis = async function(userId) {
  const history = await this.find({
    userId: userId,
    status: 'Completed',
    isActive: true
  }).sort({ year: 1 });
  
  const analysis = {
    totalYears: history.length,
    averageProgress: 0,
    strongestLift: null,
    mostConsistentProgress: null,
    goalDifficultyTrends: {
      conservative: 0,
      realistic: 0,
      aggressive: 0,
      unrealistic: 0
    }
  };
  
  if (history.length === 0) return analysis;
  
  // Calculate averages and trends
  let totalProgress = 0;
  const liftProgress = { squat: [], bench: [], deadlift: [] };
  
  history.forEach(year => {
    if (year.progress.progressMetrics) {
      const metrics = year.progress.progressMetrics;
      totalProgress += year.overallProgress || 0;
      
      liftProgress.squat.push(metrics.squatProgress || 0);
      liftProgress.bench.push(metrics.benchProgress || 0);
      liftProgress.deadlift.push(metrics.deadliftProgress || 0);
    }
  });
  
  analysis.averageProgress = Math.round((totalProgress / history.length) * 10) / 10;
  
  // Find strongest progressing lift
  const avgLiftProgress = {
    squat: liftProgress.squat.reduce((a, b) => a + b, 0) / liftProgress.squat.length,
    bench: liftProgress.bench.reduce((a, b) => a + b, 0) / liftProgress.bench.length,
    deadlift: liftProgress.deadlift.reduce((a, b) => a + b, 0) / liftProgress.deadlift.length
  };
  
  analysis.strongestLift = Object.keys(avgLiftProgress).reduce((a, b) => 
    avgLiftProgress[a] > avgLiftProgress[b] ? a : b
  );
  
  return analysis;
};

// Ensure virtual fields are serialized
annualGoalsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AnnualGoals', annualGoalsSchema);