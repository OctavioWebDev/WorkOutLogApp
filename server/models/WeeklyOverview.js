// models/WeeklyOverview.js
const mongoose = require('mongoose');

const weeklyOverviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Week Identification
  weekStartDate: { 
    type: Date, 
    required: true,
    index: true
  }, // Monday of the week
  weekEndDate: { 
    type: Date, 
    required: true 
  }, // Sunday of the week
  weekNumber: Number, // Week # of current program
  year: { type: Number, required: true },
  
  // Planning (filled at start of week)
  weeklyGoals: String,
  mainLiftFocus: String,
  programNotes: String,
  competitionPrepNotes: String,
  
  // Summary (filled at end of week)
  weekSummary: String,
  rpeTrends: String,
  bodyWeightStart: Number,
  bodyWeightEnd: Number,
  bodyWeightChange: Number,
  nextWeekPlan: String,
  
  // Meet Prep Context
  meetPrepPhase: { 
    type: String,
    enum: ['Off-Season', 'Base Building', 'Strength', 'Intensity', 'Peak', 'Competition', 'Recovery']
  },
  daysToMeet: Number,
  targetMeetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' },
  
  // Weekly Stats (auto-calculated)
  stats: {
    totalWorkouts: { type: Number, default: 0 },
    completedWorkouts: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    avgRPE: Number,
    avgSleepHours: Number,
    avgStressLevel: Number,
    maxSquat: Number,
    maxBench: Number,
    maxDeadlift: Number
  },
  
  // Weekly Objectives Tracking
  objectives: [{
    description: { type: String, required: true },
    targetValue: Number,
    actualValue: Number,
    unit: String, // 'lbs', 'kg', 'reps', '%', etc.
    completed: { type: Boolean, default: false },
    notes: String
  }],
  
  // Reflection Questions
  reflection: {
    whatWorkedWell: String,
    whatNeedsImprovement: String,
    energyLevels: { 
      type: String,
      enum: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    motivationLevel: {
      type: String,
      enum: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    recoveryQuality: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Excellent']
    },
    overallSatisfaction: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  
  // Status
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
weeklyOverviewSchema.index({ userId: 1, weekStartDate: -1 });
weeklyOverviewSchema.index({ userId: 1, year: 1 });
weeklyOverviewSchema.index({ userId: 1, meetPrepPhase: 1 });

// Update updatedAt on save
weeklyOverviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate week end date if not provided
  if (!this.weekEndDate) {
    this.weekEndDate = new Date(this.weekStartDate);
    this.weekEndDate.setDate(this.weekEndDate.getDate() + 6);
  }
  
  // Calculate body weight change
  if (this.bodyWeightStart && this.bodyWeightEnd) {
    this.bodyWeightChange = this.bodyWeightEnd - this.bodyWeightStart;
  }
  
  // Set year if not provided
  if (!this.year) {
    this.year = this.weekStartDate.getFullYear();
  }
  
  // Set completedAt if marking complete
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Virtual for week progress percentage
weeklyOverviewSchema.virtual('progressPercentage').get(function() {
  if (this.stats.totalWorkouts === 0) return 0;
  return Math.round((this.stats.completedWorkouts / this.stats.totalWorkouts) * 100);
});

// Virtual for objectives completion
weeklyOverviewSchema.virtual('objectivesCompletion').get(function() {
  if (this.objectives.length === 0) return 100;
  const completed = this.objectives.filter(obj => obj.completed).length;
  return Math.round((completed / this.objectives.length) * 100);
});

// Method to calculate stats from workouts
weeklyOverviewSchema.methods.calculateStatsFromWorkouts = async function() {
  const Workout = mongoose.model('Workout');
  
  const workouts = await Workout.find({
    userId: this.userId,
    date: {
      $gte: this.weekStartDate,
      $lte: this.weekEndDate
    }
  });
  
  let totalVolume = 0;
  let rpeSum = 0;
  let rpeCount = 0;
  let sleepSum = 0;
  let sleepCount = 0;
  let stressSum = 0;
  let stressCount = 0;
  let maxSquat = 0;
  let maxBench = 0;
  let maxDeadlift = 0;
  
  const completedWorkouts = workouts.filter(w => w.isCompleted);
  
  workouts.forEach(workout => {
    // Calculate total volume
    totalVolume += workout.totalVolume || 0;
    
    // Track sleep and stress
    if (workout.sleepHours) {
      sleepSum += workout.sleepHours;
      sleepCount++;
    }
    if (workout.stressLevel) {
      stressSum += workout.stressLevel;
      stressCount++;
    }
    
    // Process main lifts
    workout.mainLifts.forEach(lift => {
      lift.sets.forEach(set => {
        if (set.rpe && set.completed) {
          rpeSum += set.rpe;
          rpeCount++;
        }
        
        if (set.weight && set.completed) {
          // Track max weights for main lifts
          const exerciseLower = lift.exercise.toLowerCase();
          if (exerciseLower.includes('squat') && set.weight > maxSquat) {
            maxSquat = set.weight;
          } else if (exerciseLower.includes('bench') && set.weight > maxBench) {
            maxBench = set.weight;
          } else if (exerciseLower.includes('deadlift') && set.weight > maxDeadlift) {
            maxDeadlift = set.weight;
          }
        }
      });
    });
  });
  
  // Update stats
  this.stats = {
    totalWorkouts: workouts.length,
    completedWorkouts: completedWorkouts.length,
    totalVolume: totalVolume,
    avgRPE: rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : null,
    avgSleepHours: sleepCount > 0 ? Math.round((sleepSum / sleepCount) * 10) / 10 : null,
    avgStressLevel: stressCount > 0 ? Math.round((stressSum / stressCount) * 10) / 10 : null,
    maxSquat: maxSquat || null,
    maxBench: maxBench || null,
    maxDeadlift: maxDeadlift || null
  };
  
  return this.stats;
};

// Static method to get or create weekly overview
weeklyOverviewSchema.statics.getOrCreateWeeklyOverview = async function(userId, date) {
  // Get Monday of the week for the given date
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  
  // Try to find existing overview
  let overview = await this.findOne({
    userId: userId,
    weekStartDate: weekStart
  });
  
  // Create if doesn't exist
  if (!overview) {
    overview = await this.create({
      userId: userId,
      weekStartDate: weekStart,
      year: weekStart.getFullYear()
    });
  }
  
  return overview;
};

// Static method to get weekly trends
weeklyOverviewSchema.statics.getWeeklyTrends = async function(userId, weeks = 8) {
  const trends = await this.find({
    userId: userId,
    isCompleted: true
  })
  .sort({ weekStartDate: -1 })
  .limit(weeks)
  .select('weekStartDate stats reflection bodyWeightStart bodyWeightEnd');
  
  return trends.reverse(); // Oldest first for trend analysis
};

// Ensure virtual fields are serialized
weeklyOverviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('WeeklyOverview', weeklyOverviewSchema);