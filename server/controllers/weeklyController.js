// controllers/weeklyController.js
const { WeeklyOverview, Workout } = require('../models');

// @desc    Get weekly overviews for user
// @route   GET /api/weekly
// @access  Private
exports.getWeeklyOverviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, year, month } = req.query;

    // Build query
    const query = { userId: req.user.id };
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (month) {
      const startDate = new Date(year || new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(year || new Date().getFullYear(), month, 0);
      query.weekStartDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Execute query with pagination
    const overviews = await WeeklyOverview.find(query)
      .sort({ weekStartDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('targetMeetId', 'name date');

    // Get total count
    const total = await WeeklyOverview.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: overviews.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        overviews
      }
    });
  } catch (error) {
    console.error('Get weekly overviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weekly overviews'
    });
  }
};

// @desc    Get single weekly overview
// @route   GET /api/weekly/:id
// @access  Private
exports.getWeeklyOverview = async (req, res) => {
  try {
    const overview = await WeeklyOverview.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('targetMeetId', 'name date location');

    if (!overview) {
      return res.status(404).json({
        status: 'error',
        message: 'Weekly overview not found'
      });
    }

    // Get workouts for this week
    const workouts = await Workout.find({
      userId: req.user.id,
      date: {
        $gte: overview.weekStartDate,
        $lte: overview.weekEndDate
      }
    }).sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        overview,
        workouts
      }
    });
  } catch (error) {
    console.error('Get weekly overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weekly overview'
    });
  }
};

// @desc    Get or create weekly overview by date
// @route   GET /api/weekly/date/:date
// @access  Private
exports.getWeeklyOverviewByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const overview = await WeeklyOverview.getOrCreateWeeklyOverview(req.user.id, date);
    
    // Calculate stats from workouts
    await overview.calculateStatsFromWorkouts();
    await overview.save();

    // Get workouts for this week
    const workouts = await Workout.find({
      userId: req.user.id,
      date: {
        $gte: overview.weekStartDate,
        $lte: overview.weekEndDate
      }
    }).sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        overview,
        workouts
      }
    });
  } catch (error) {
    console.error('Get weekly overview by date error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weekly overview'
    });
  }
};

// @desc    Update weekly overview
// @route   PUT /api/weekly/:id
// @access  Private
exports.updateWeeklyOverview = async (req, res) => {
  try {
    let overview = await WeeklyOverview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!overview) {
      return res.status(404).json({
        status: 'error',
        message: 'Weekly overview not found'
      });
    }

    // Update overview
    overview = await WeeklyOverview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Recalculate stats if requested
    if (req.body.recalculateStats) {
      await overview.calculateStatsFromWorkouts();
      await overview.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        overview
      }
    });
  } catch (error) {
    console.error('Update weekly overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating weekly overview'
    });
  }
};

// @desc    Add objective to weekly overview
// @route   POST /api/weekly/:id/objectives
// @access  Private
exports.addObjective = async (req, res) => {
  try {
    const overview = await WeeklyOverview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!overview) {
      return res.status(404).json({
        status: 'error',
        message: 'Weekly overview not found'
      });
    }

    // Add new objective
    overview.objectives.push(req.body);
    await overview.save();

    res.status(201).json({
      status: 'success',
      data: {
        overview
      }
    });
  } catch (error) {
    console.error('Add objective error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding objective'
    });
  }
};

// @desc    Update objective
// @route   PUT /api/weekly/:id/objectives/:objectiveId
// @access  Private
exports.updateObjective = async (req, res) => {
  try {
    const overview = await WeeklyOverview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!overview) {
      return res.status(404).json({
        status: 'error',
        message: 'Weekly overview not found'
      });
    }

    // Find and update objective
    const objective = overview.objectives.id(req.params.objectiveId);
    if (!objective) {
      return res.status(404).json({
        status: 'error',
        message: 'Objective not found'
      });
    }

    // Update objective fields
    Object.keys(req.body).forEach(key => {
      objective[key] = req.body[key];
    });

    await overview.save();

    res.status(200).json({
      status: 'success',
      data: {
        overview
      }
    });
  } catch (error) {
    console.error('Update objective error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating objective'
    });
  }
};

// @desc    Delete objective
// @route   DELETE /api/weekly/:id/objectives/:objectiveId
// @access  Private
exports.deleteObjective = async (req, res) => {
  try {
    const overview = await WeeklyOverview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!overview) {
      return res.status(404).json({
        status: 'error',
        message: 'Weekly overview not found'
      });
    }

    // Remove objective
    overview.objectives.pull(req.params.objectiveId);
    await overview.save();

    res.status(200).json({
      status: 'success',
      data: {
        overview
      }
    });
  } catch (error) {
    console.error('Delete objective error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting objective'
    });
  }
};

// @desc    Get weekly trends
// @route   GET /api/weekly/trends
// @access  Private
exports.getWeeklyTrends = async (req, res) => {
  try {
    const { weeks = 8 } = req.query;
    
    const trends = await WeeklyOverview.getWeeklyTrends(req.user.id, parseInt(weeks));

    // Calculate trend metrics
    const trendMetrics = {
      volumeTrend: calculateTrend(trends.map(t => t.stats.totalVolume)),
      avgRPETrend: calculateTrend(trends.map(t => t.stats.avgRPE)),
      sleepTrend: calculateTrend(trends.map(t => t.stats.avgSleepHours)),
      stressTrend: calculateTrend(trends.map(t => t.stats.avgStressLevel)),
      bodyWeightTrend: calculateTrend(trends.map(t => t.bodyWeightEnd)),
      completionTrend: calculateTrend(trends.map(t => t.progressPercentage))
    };

    res.status(200).json({
      status: 'success',
      data: {
        trends,
        trendMetrics,
        period: {
          weeks: parseInt(weeks),
          startDate: trends[0]?.weekStartDate,
          endDate: trends[trends.length - 1]?.weekEndDate
        }
      }
    });
  } catch (error) {
    console.error('Get weekly trends error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weekly trends'
    });
  }
};

// @desc    Complete weekly overview
// @route   POST /api/weekly/:id/complete
// @access  Private
exports.completeWeeklyOverview = async (req, res) => {
  try {
    const overview = await WeeklyOverview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!overview) {
      return res.status(404).json({
        status: 'error',
        message: 'Weekly overview not found'
      });
    }

    // Calculate final stats
    await overview.calculateStatsFromWorkouts();
    
    // Mark as completed
    overview.isCompleted = true;
    overview.completedAt = new Date();
    
    // Update any final reflection data
    if (req.body.reflection) {
      overview.reflection = { ...overview.reflection, ...req.body.reflection };
    }

    await overview.save();

    res.status(200).json({
      status: 'success',
      data: {
        overview
      }
    });
  } catch (error) {
    console.error('Complete weekly overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error completing weekly overview'
    });
  }
};

// Helper function to calculate trend direction
function calculateTrend(values) {
  const validValues = values.filter(v => v !== null && v !== undefined && !isNaN(v));
  if (validValues.length < 2) return { direction: 'stable', change: 0 };

  const first = validValues[0];
  const last = validValues[validValues.length - 1];
  const change = ((last - first) / first) * 100;

  let direction = 'stable';
  if (Math.abs(change) > 5) {
    direction = change > 0 ? 'increasing' : 'decreasing';
  }

  return {
    direction,
    change: Math.round(change * 10) / 10,
    first,
    last
  };
}