// models/Competition.js
const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Competition Details
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [200, 'Competition name cannot exceed 200 characters']
  },
  date: { 
    type: Date, 
    required: true,
    index: true
  },
  location: {
    venue: String,
    city: String,
    state: String,
    country: { type: String, default: 'United States' }
  },
  federation: { 
    type: String,
    enum: ['USAPL', 'IPF', 'USPA', 'IPL', 'RPS', 'SPF', 'WPC', 'CPU', 'Other'],
    required: true
  },
  
  // Competition Type
  competitionType: {
    type: String,
    enum: ['Local', 'Regional', 'National', 'International', 'Online', 'Mock'],
    default: 'Local'
  },
  sanctioned: { type: Boolean, default: true },
  
  // Goals and Planning
  goalTotal: Number,
  priorityLevel: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  
  // Meet Prep Planning
  prepStartDate: Date,
  prepWeeks: { 
    type: Number,
    min: 4,
    max: 20,
    default: 12
  },
  peakWeek: Date,
  
  // Registration & Admin
  registrationStatus: {
    type: String,
    enum: ['Planning', 'Registered', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Planning'
  },
  registrationDate: Date,
  entryFee: Number,
  weightClass: String,
  ageCategory: String,
  division: String, // Raw, Equipped, etc.
  
  // Attempt Planning
  plannedAttempts: {
    squat: {
      opener: { weight: Number, percentage: Number },
      second: { weight: Number, percentage: Number },
      third: { weight: Number, percentage: Number }
    },
    bench: {
      opener: { weight: Number, percentage: Number },
      second: { weight: Number, percentage: Number },
      third: { weight: Number, percentage: Number }
    },
    deadlift: {
      opener: { weight: Number, percentage: Number },
      second: { weight: Number, percentage: Number },
      third: { weight: Number, percentage: Number }
    }
  },
  
  // Competition Day Results
  results: {
    actualBodyWeight: Number,
    actualWeightClass: String,
    weighInTime: String,
    flightNumber: Number,
    
    squat: {
      opener: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      second: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      third: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      best: Number,
      prAttempt: Boolean
    },
    
    bench: {
      opener: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      second: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      third: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      best: Number,
      prAttempt: Boolean
    },
    
    deadlift: {
      opener: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      second: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      third: { 
        weight: Number, 
        made: Boolean, 
        attempts: Number,
        rpe: Number,
        notes: String 
      },
      best: Number,
      prAttempt: Boolean
    },
    
    // Final Results
    total: Number,
    placement: Number,
    totalLifters: Number,
    wilksScore: Number,
    dotsScore: Number,
    glossbrennerScore: Number,
    
    // Awards & Achievements
    awards: [String], // ['1st Place', 'Best Lifter', etc.]
    qualifiedFor: [String], // ['Nationals', 'Worlds', etc.]
    
    // Performance Analysis
    totalMade: Number, // out of 9
    squatMade: Number, // out of 3
    benchMade: Number, // out of 3
    deadliftMade: Number // out of 3
  },
  
  // Travel & Logistics
  travel: {
    hotelBooked: Boolean,
    hotelName: String,
    checkInDate: Date,
    checkOutDate: Date,
    flightBooked: Boolean,
    transportationNotes: String,
    estimatedCost: Number,
    actualCost: Number
  },
  
  // Gear & Equipment
  gear: {
    singlet: String,
    shoes: String,
    belt: String,
    wraps: String,
    sleeves: String,
    other: String,
    backupGear: String,
    gearChecked: Boolean
  },
  
  // Team & Support
  team: {
    coach: String,
    handler: String,
    teammates: [String],
    supporters: [String]
  },
  
  // Pre-competition Notes
  strategy: String,
  mentalPrep: String,
  nutritionPlan: String,
  warmupPlan: String,
  
  // Post-competition Reflection
  reflection: {
    overallSatisfaction: { type: Number, min: 1, max: 10 },
    whatWorkedWell: String,
    areasForImprovement: String,
    lessonsLearned: String,
    nextCompetitionGoals: String,
    wouldCompeteAgain: Boolean
  },
  
  // Status Tracking
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
competitionSchema.index({ userId: 1, date: -1 });
competitionSchema.index({ userId: 1, registrationStatus: 1 });
competitionSchema.index({ userId: 1, competitionType: 1 });
competitionSchema.index({ date: 1 });
competitionSchema.index({ federation: 1, date: 1 });

// Update updatedAt on save
competitionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-calculate prep start date if not set
  if (this.date && this.prepWeeks && !this.prepStartDate) {
    this.prepStartDate = new Date(this.date);
    this.prepStartDate.setDate(this.prepStartDate.getDate() - (this.prepWeeks * 7));
  }
  
  // Auto-calculate peak week (1 week before competition)
  if (this.date && !this.peakWeek) {
    this.peakWeek = new Date(this.date);
    this.peakWeek.setDate(this.peakWeek.getDate() - 7);
  }
  
  // Calculate totals and success rates if results exist
  if (this.results) {
    this.calculateResults();
  }
  
  // Set completedAt if marking complete
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Virtual for days until competition
competitionSchema.virtual('daysUntilCompetition').get(function() {
  if (this.isCompleted || this.date < new Date()) return 0;
  
  const today = new Date();
  const timeDiff = this.date.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for prep phase
competitionSchema.virtual('prepPhase').get(function() {
  if (this.isCompleted) return 'Completed';
  if (!this.prepStartDate) return 'Planning';
  
  const today = new Date();
  if (today < this.prepStartDate) return 'Pre-Prep';
  
  const daysIntoPrep = Math.floor((today - this.prepStartDate) / (1000 * 60 * 60 * 24));
  const totalPrepDays = this.prepWeeks * 7;
  const prepPercentage = (daysIntoPrep / totalPrepDays) * 100;
  
  if (prepPercentage < 25) return 'Base Building';
  if (prepPercentage < 50) return 'Strength';
  if (prepPercentage < 75) return 'Intensity';
  if (prepPercentage < 90) return 'Peak';
  return 'Competition Week';
});

// Virtual for success rate
competitionSchema.virtual('successRate').get(function() {
  if (!this.results || !this.results.totalMade) return 0;
  return Math.round((this.results.totalMade / 9) * 100);
});

// Method to calculate results
competitionSchema.methods.calculateResults = function() {
  if (!this.results) return;
  
  let totalMade = 0;
  let squatMade = 0;
  let benchMade = 0;
  let deadliftMade = 0;
  
  // Count successful attempts
  ['squat', 'bench', 'deadlift'].forEach(lift => {
    const liftResults = this.results[lift];
    if (!liftResults) return;
    
    ['opener', 'second', 'third'].forEach(attempt => {
      if (liftResults[attempt] && liftResults[attempt].made) {
        totalMade++;
        if (lift === 'squat') squatMade++;
        if (lift === 'bench') benchMade++;
        if (lift === 'deadlift') deadliftMade++;
      }
    });
    
    // Calculate best lift
    const attempts = [liftResults.opener, liftResults.second, liftResults.third];
    const madeAttempts = attempts.filter(att => att && att.made && att.weight);
    liftResults.best = madeAttempts.length > 0 ? 
      Math.max(...madeAttempts.map(att => att.weight)) : 0;
  });
  
  // Update totals
  this.results.totalMade = totalMade;
  this.results.squatMade = squatMade;
  this.results.benchMade = benchMade;
  this.results.deadliftMade = deadliftMade;
  
  // Calculate total
  const bestSquat = this.results.squat?.best || 0;
  const bestBench = this.results.bench?.best || 0;
  const bestDeadlift = this.results.deadlift?.best || 0;
  this.results.total = bestSquat + bestBench + bestDeadlift;
};

// Method to suggest attempts based on current PRs
competitionSchema.methods.suggestAttempts = async function() {
  const PersonalRecord = mongoose.model('PersonalRecord');
  
  // Get best lifts for this user
  const bestLifts = await PersonalRecord.getBestLifts(this.userId);
  
  const suggestions = {
    squat: this.calculateAttemptProgression(bestLifts.squat?.weight),
    bench: this.calculateAttemptProgression(bestLifts.bench?.weight),
    deadlift: this.calculateAttemptProgression(bestLifts.deadlift?.weight)
  };
  
  return suggestions;
};

// Helper method to calculate attempt progression
competitionSchema.methods.calculateAttemptProgression = function(currentMax) {
  if (!currentMax) return { opener: 0, second: 0, third: 0 };
  
  return {
    opener: Math.round(currentMax * 0.90), // 90% for safe opener
    second: Math.round(currentMax * 1.02), // 102% for small PR
    third: Math.round(currentMax * 1.05)   // 105% for ambitious PR
  };
};

// Static method to get upcoming competitions
competitionSchema.statics.getUpcomingCompetitions = async function(userId, days = 90) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return await this.find({
    userId: userId,
    date: { 
      $gte: new Date(),
      $lte: futureDate
    },
    registrationStatus: { $ne: 'Cancelled' }
  }).sort({ date: 1 });
};

// Static method to get competition history
competitionSchema.statics.getCompetitionHistory = async function(userId, limit = 10) {
  return await this.find({
    userId: userId,
    isCompleted: true
  })
  .sort({ date: -1 })
  .limit(limit)
  .select('name date federation results.total results.placement competitionType');
};

// Static method to get competition stats
competitionSchema.statics.getCompetitionStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isCompleted: true } },
    {
      $group: {
        _id: null,
        totalCompetitions: { $sum: 1 },
        avgTotal: { $avg: '$results.total' },
        bestTotal: { $max: '$results.total' },
        avgSuccessRate: { $avg: { $divide: ['$results.totalMade', 9] } },
        firstPlaces: {
          $sum: { $cond: [{ $eq: ['$results.placement', 1] }, 1, 0] }
        },
        topThreePlacements: {
          $sum: { $cond: [{ $lte: ['$results.placement', 3] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalCompetitions: 0,
    avgTotal: 0,
    bestTotal: 0,
    avgSuccessRate: 0,
    firstPlaces: 0,
    topThreePlacements: 0
  };
};

// Ensure virtual fields are serialized
competitionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Competition', competitionSchema);