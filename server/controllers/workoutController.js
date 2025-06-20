// controllers/workoutController.js
const { Workout, WeeklyOverview, PersonalRecord, User } = require('../models');

// @desc    Get all workouts for user
// @route   GET /api/workouts
// @access  Private
exports.getWorkouts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      workoutType,
      completed
    } = req.query;

    // Build query
    const query = { userId: req.user.id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (workoutType) query.workoutType = workoutType;
    if (completed !== undefined) query.isCompleted = completed === 'true';

    // Execute query with pagination
    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Workout.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: workouts.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        workouts
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching workouts'
    });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching workout'
    });
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
exports.createWorkout = async (req, res) => {
  try {
    // Add user ID to workout data
    const workoutData = {
      ...req.body,
      userId: req.user.id
    };

    // Ensure date is provided
    if (!workoutData.date) {
      workoutData.date = new Date();
    }

    const workout = await Workout.create(workoutData);

    // Update or create weekly overview
    await updateWeeklyOverview(req.user.id, workout.date);

    res.status(201).json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating workout'
    });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res) => {
  try {
    let workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Update workout
    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Check for new PRs if workout is being completed
    if (req.body.isCompleted && !workout.isCompleted) {
      await checkForPersonalRecords(workout);
    }

    // Update weekly overview
    await updateWeeklyOverview(req.user.id, workout.date);

    res.status(200).json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating workout'
    });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    await workout.deleteOne();

    // Update weekly overview
    await updateWeeklyOverview(req.user.id, workout.date);

    res.status(200).json({
      status: 'success',
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting workout'
    });
  }
};

// @desc    Get workout by date
// @route   GET /api/workouts/date/:date
// @access  Private
exports.getWorkoutByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const workout = await Workout.findOne({
      userId: req.user.id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'No workout found for this date'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Get workout by date error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching workout for date'
    });
  }
};

// @desc    Get workout stats
// @route   GET /api/workouts/stats
// @access  Private
exports.getWorkoutStats = async (req, res) => {
  try {
    const { startDate, endDate, period = '30' } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - parseInt(period));
    }

    // Get workout stats
    const stats = await Workout.getWorkoutStats(req.user.id, start, end);

    // Get recent PRs
    const recentPRs = await PersonalRecord.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    })
    .sort({ date: -1 })
    .limit(5)
    .select('lift weight reps date context');

    // Get weekly completion rates
    const weeklyCompletion = await Workout.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$date' },
            year: { $year: '$date' }
          },
          totalWorkouts: { $sum: 1 },
          completedWorkouts: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completedWorkouts', '$totalWorkouts'] },
              100
            ]
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        recentPRs,
        weeklyCompletion,
        period: {
          start,
          end,
          days: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        }
      }
    });
  } catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching workout stats'
    });
  }
};

// @desc    Copy workout template
// @route   POST /api/workouts/:id/copy
// @access  Private
exports.copyWorkout = async (req, res) => {
  try {
    const originalWorkout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!originalWorkout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }

    // Create new workout based on original
    const newWorkoutData = {
      userId: req.user.id,
      date: req.body.date || new Date(),
      workoutType: originalWorkout.workoutType,
      weekNumber: req.body.weekNumber || originalWorkout.weekNumber,
      daysToMeet: req.body.daysToMeet || originalWorkout.daysToMeet,
      mainLifts: originalWorkout.mainLifts.map(lift => ({
        exercise: lift.exercise,
        sets: lift.sets.map(set => ({
          setNumber: set.setNumber,
          reps: set.targetReps || set.reps,
          weight: set.targetWeight || set.weight,
          rpe: set.targetRPE || set.rpe,
          isWarmup: set.isWarmup,
          completed: false
        })),
        exerciseNotes: lift.exerciseNotes,
        targetSets: lift.targetSets,
        targetReps: lift.targetReps,
        targetWeight: lift.targetWeight,
        targetRPE: lift.targetRPE
      })),
      accessories: originalWorkout.accessories.map(accessory => ({
        exercise: accessory.exercise,
        sets: accessory.sets.map(set => ({
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
          isWarmup: set.isWarmup,
          completed: false
        })),
        exerciseNotes: accessory.exerciseNotes,
        targetSets: accessory.targetSets,
        targetReps: accessory.targetReps,
        targetWeight: accessory.targetWeight
      })),
      isCompleted: false
    };

    const newWorkout = await Workout.create(newWorkoutData);

    res.status(201).json({
      status: 'success',
      data: {
        workout: newWorkout
      }
    });
  } catch (error) {
    console.error('Copy workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error copying workout'
    });
  }
};

// Helper function to update weekly overview
async function updateWeeklyOverview(userId, workoutDate) {
  try {
    const overview = await WeeklyOverview.getOrCreateWeeklyOverview(userId, workoutDate);
    await overview.calculateStatsFromWorkouts();
    await overview.save();
  } catch (error) {
    console.error('Error updating weekly overview:', error);
  }
}

// Helper function to check for personal records
async function checkForPersonalRecords(workout) {
  try {
    const newPRs = [];

    // Check main lifts for PRs
    for (const lift of workout.mainLifts) {
      for (const set of lift.sets) {
        if (set.completed && set.weight && set.reps) {
          const pr = await PersonalRecord.createFromWorkout(
            workout._id,
            workout.userId,
            lift.exercise,
            set.weight,
            set.reps,
            workout.date,
            set.rpe
          );
          
          if (pr) {
            newPRs.push(pr);
          }
        }
      }
    }

    return newPRs;
  } catch (error) {
    console.error('Error checking for PRs:', error);
    return [];
  }
}