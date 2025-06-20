// models/PersonalRecord.js
const mongoose = require('mongoose');

const personalRecordSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  lift: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  }, // 'Squat', 'Bench Press', 'Deadlift', etc.
  
  weight: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  reps: { 
    type: Number, 
    default: 1,
    min: 1
  }, // For rep PRs
  
  date: { 
    type: Date, 
    required: true,
    index: true
  },
  
  context: { 
    type: String, 
    enum: ['training', 'competition'],
    required: true 
  },
  
  // Competition context if applicable
  competitionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Competition' 
  },
  competitionName: String,
  
  // Training context
  workoutId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workout' 
  },
  
  // Additional details
  rpe: {
    type: Number,
    min: 1,
    max: 10
  },
  bodyWeight: Number,
  notes: String,
  videoUrl: String, // Optional video link
  
  // Calculated fields
  wilksScore: Number,
  dotsScore: Number,
  estimatedOneRepMax: Number, // For rep PRs
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verifiedBy: String, // Coach, judge, etc.
  
  // Status
  isActive: { type: Boolean, default: true }, // For soft deletion
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
personalRecordSchema.index({ userId: 1, lift: 1, date: -1 });
personalRecordSchema.index({ userId: 1, context: 1 });
personalRecordSchema.index({ userId: 1, weight: -1 });
personalRecordSchema.index({ date: -1 });

// Update updatedAt on save
personalRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate estimated 1RM for rep PRs using Brzycki formula
  if (this.reps > 1) {
    this.estimatedOneRepMax = Math.round(this.weight / (1.0278 - (0.0278 * this.reps)));
  } else {
    this.estimatedOneRepMax = this.weight;
  }
  
  next();
});

// Virtual for display weight (handles 1RM vs rep PRs)
personalRecordSchema.virtual('displayWeight').get(function() {
  if (this.reps === 1) {
    return `${this.weight} lbs`;
  } else {
    return `${this.weight} lbs x ${this.reps} (est. 1RM: ${this.estimatedOneRepMax} lbs)`;
  }
});

// Virtual for PR type
personalRecordSchema.virtual('prType').get(function() {
  if (this.reps === 1) {
    return '1RM';
  } else {
    return `${this.reps}RM`;
  }
});

// Method to check if this is a new PR
personalRecordSchema.methods.isNewPR = async function() {
  const existingPRs = await this.constructor.find({
    userId: this.userId,
    lift: this.lift,
    reps: this.reps,
    date: { $lt: this.date },
    isActive: true
  }).sort({ weight: -1, date: -1 });
  
  if (existingPRs.length === 0) {
    return true; // First PR for this lift/rep combo
  }
  
  return this.weight > existingPRs[0].weight;
};

// Static method to get current PRs for a user
personalRecordSchema.statics.getCurrentPRs = async function(userId) {
  const prs = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true
      }
    },
    {
      $sort: { date: -1, weight: -1 }
    },
    {
      $group: {
        _id: {
          lift: '$lift',
          reps: '$reps'
        },
        latestPR: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$latestPR' }
    },
    {
      $sort: { lift: 1, reps: 1 }
    }
  ]);
  
  return prs;
};

// Static method to get PR history for a specific lift
personalRecordSchema.statics.getPRHistory = async function(userId, liftName, reps = 1) {
  return await this.find({
    userId: userId,
    lift: new RegExp(liftName, 'i'), // Case insensitive
    reps: reps,
    isActive: true
  })
  .sort({ date: -1 })
  .populate('competitionId', 'name date')
  .populate('workoutId', 'date');
};

// Static method to get best lifts for powerlifting total
personalRecordSchema.statics.getBestLifts = async function(userId) {
  const bestLifts = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true,
        reps: 1 // Only 1RMs for official total
      }
    },
    {
      $addFields: {
        liftCategory: {
          $switch: {
            branches: [
              { case: { $regexMatch: { input: '$lift', regex: /squat/i } }, then: 'squat' },
              { case: { $regexMatch: { input: '$lift', regex: /bench/i } }, then: 'bench' },
              { case: { $regexMatch: { input: '$lift', regex: /deadlift/i } }, then: 'deadlift' }
            ],
            default: 'other'
          }
        }
      }
    },
    {
      $match: {
        liftCategory: { $in: ['squat', 'bench', 'deadlift'] }
      }
    },
    {
      $sort: { weight: -1, date: -1 }
    },
    {
      $group: {
        _id: '$liftCategory',
        bestLift: { $first: '$$ROOT' }
      }
    }
  ]);
  
  const result = {
    squat: null,
    bench: null,
    deadlift: null,
    total: 0
  };
  
  bestLifts.forEach(lift => {
    result[lift._id] = lift.bestLift;
    result.total += lift.bestLift.weight;
  });
  
  return result;
};

// Static method to create PR from workout
personalRecordSchema.statics.createFromWorkout = async function(workoutId, userId, exercise, weight, reps, date, rpe = null) {
  // Check if this is actually a PR
  const existingPR = await this.findOne({
    userId: userId,
    lift: exercise,
    reps: reps,
    weight: { $gte: weight },
    isActive: true
  });
  
  if (existingPR) {
    return null; // Not a PR
  }
  
  // Create the PR
  const pr = new this({
    userId: userId,
    lift: exercise,
    weight: weight,
    reps: reps,
    date: date,
    context: 'training',
    workoutId: workoutId,
    rpe: rpe
  });
  
  await pr.save();
  return pr;
};

// Static method to get PR trends over time
personalRecordSchema.statics.getPRTrends = async function(userId, liftName, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return await this.find({
    userId: userId,
    lift: new RegExp(liftName, 'i'),
    date: { $gte: startDate },
    isActive: true
  })
  .sort({ date: 1 })
  .select('date weight reps context estimatedOneRepMax');
};

// Ensure virtual fields are serialized
personalRecordSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('PersonalRecord', personalRecordSchema);