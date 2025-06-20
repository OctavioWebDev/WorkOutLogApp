// models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Workout Identity
  date: { 
    type: Date, 
    required: true,
    index: true
  },
  workoutType: { 
    type: String, 
    enum: ['training', 'rest'], 
    default: 'training' 
  },
  weekNumber: Number, // Program week #
  daysToMeet: Number,
  
  // Main Lifts
  mainLifts: [{
    exercise: { 
      type: String, 
      required: true,
      trim: true
    }, // "Squat", "Bench Press", "Deadlift", etc.
    sets: [{
      setNumber: { type: Number, required: true },
      reps: { type: Number, min: 0 },
      weight: { type: Number, min: 0 },
      rpe: { 
        type: Number, 
        min: 1, 
        max: 10,
        validate: {
          validator: function(v) {
            return v === null || (v >= 1 && v <= 10);
          },
          message: 'RPE must be between 1 and 10'
        }
      },
      notes: String,
      isWarmup: { type: Boolean, default: false },
      completed: { type: Boolean, default: true }
    }],
    exerciseNotes: String,
    targetSets: Number,
    targetReps: Number,
    targetWeight: Number,
    targetRPE: Number
  }],
  
  // Accessory Work
  accessories: [{
    exercise: { 
      type: String, 
      required: true,
      trim: true
    },
    sets: [{
      setNumber: { type: Number, required: true },
      reps: { type: Number, min: 0 },
      weight: { type: Number, min: 0 },
      rpe: { 
        type: Number, 
        min: 1, 
        max: 10,
        validate: {
          validator: function(v) {
            return v === null || (v >= 1 && v <= 10);
          },
          message: 'RPE must be between 1 and 10'
        }
      },
      notes: String,
      isWarmup: { type: Boolean, default: false },
      completed: { type: Boolean, default: true }
    }],
    exerciseNotes: String,
    targetSets: Number,
    targetReps: Number,
    targetWeight: Number
  }],
  
  // Daily Metrics
  dailyNotes: String, // How weight moved, energy, technique cues
  workoutDuration: Number, // minutes
  
  // Recovery Data
  sleepHours: { 
    type: Number, 
    min: 0, 
    max: 24,
    validate: {
      validator: function(v) {
        return v === null || (v >= 0 && v <= 24);
      },
      message: 'Sleep hours must be between 0 and 24'
    }
  },
  stressLevel: { 
    type: Number, 
    min: 1, 
    max: 10,
    validate: {
      validator: function(v) {
        return v === null || (v >= 1 && v <= 10);
      },
      message: 'Stress level must be between 1 and 10'
    }
  },
  bodyWeight: { type: Number, min: 0 },
  
  // Rest Day Specific (when workoutType is 'rest')
  recoveryActivities: String,
  mealPrepNotes: String,
  mentalNotes: String,
  tomorrowsTrainingPrep: String,
  
  // Workout Status
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, workoutType: 1 });
workoutSchema.index({ userId: 1, isCompleted: 1 });
workoutSchema.index({ date: -1 });

// Update updatedAt on save
workoutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt if workout is being marked complete
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Virtual for workout completion percentage
workoutSchema.virtual('completionPercentage').get(function() {
  if (this.workoutType === 'rest') return 100;
  
  let totalExercises = this.mainLifts.length + this.accessories.length;
  if (totalExercises === 0) return 0;
  
  let completedExercises = 0;
  
  // Check main lifts
  this.mainLifts.forEach(lift => {
    if (lift.sets && lift.sets.length > 0 && lift.sets.some(set => set.completed)) {
      completedExercises++;
    }
  });
  
  // Check accessories
  this.accessories.forEach(accessory => {
    if (accessory.sets && accessory.sets.length > 0 && accessory.sets.some(set => set.completed)) {
      completedExercises++;
    }
  });
  
  return Math.round((completedExercises / totalExercises) * 100);
});

// Virtual for total volume (weight x reps)
workoutSchema.virtual('totalVolume').get(function() {
  let volume = 0;
  
  // Main lifts volume
  this.mainLifts.forEach(lift => {
    lift.sets.forEach(set => {
      if (set.weight && set.reps && set.completed) {
        volume += set.weight * set.reps;
      }
    });
  });
  
  // Accessory volume
  this.accessories.forEach(accessory => {
    accessory.sets.forEach(set => {
      if (set.weight && set.reps && set.completed) {
        volume += set.weight * set.reps;
      }
    });
  });
  
  return volume;
});

// Method to get max weight for a specific exercise
workoutSchema.methods.getMaxWeightForExercise = function(exerciseName) {
  let maxWeight = 0;
  
  // Check main lifts
  this.mainLifts.forEach(lift => {
    if (lift.exercise.toLowerCase() === exerciseName.toLowerCase()) {
      lift.sets.forEach(set => {
        if (set.weight && set.completed && set.weight > maxWeight) {
          maxWeight = set.weight;
        }
      });
    }
  });
  
  // Check accessories
  this.accessories.forEach(accessory => {
    if (accessory.exercise.toLowerCase() === exerciseName.toLowerCase()) {
      accessory.sets.forEach(set => {
        if (set.weight && set.completed && set.weight > maxWeight) {
          maxWeight = set.weight;
        }
      });
    }
  });
  
  return maxWeight;
};

// Static method to get workout stats for date range
workoutSchema.statics.getWorkoutStats = async function(userId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
        isCompleted: true
      }
    },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        trainingDays: {
          $sum: { $cond: [{ $eq: ['$workoutType', 'training'] }, 1, 0] }
        },
        restDays: {
          $sum: { $cond: [{ $eq: ['$workoutType', 'rest'] }, 1, 0] }
        },
        avgSleepHours: { $avg: '$sleepHours' },
        avgStressLevel: { $avg: '$stressLevel' },
        avgBodyWeight: { $avg: '$bodyWeight' }
      }
    }
  ]);
  
  return stats[0] || {
    totalWorkouts: 0,
    trainingDays: 0,
    restDays: 0,
    avgSleepHours: null,
    avgStressLevel: null,
    avgBodyWeight: null
  };
};

// Ensure virtual fields are serialized
workoutSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Workout', workoutSchema);