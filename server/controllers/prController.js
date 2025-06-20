// controllers/prController.js
const { PersonalRecord, User } = require('../models');

// @desc    Get all personal records for user
// @route   GET /api/prs
// @access  Private
exports.getPersonalRecords = async (req, res) => {
  try {
    const { lift, context, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { userId: req.user.id, isActive: true };
    
    if (lift) {
      query.lift = new RegExp(lift, 'i'); // Case insensitive search
    }
    
    if (context) {
      query.context = context;
    }

    // Execute query with pagination
    const prs = await PersonalRecord.find(query)
      .sort({ date: -1, weight: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('competitionId', 'name date location')
      .populate('workoutId', 'date');

    // Get total count
    const total = await PersonalRecord.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: prs.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        personalRecords: prs
      }
    });
  } catch (error) {
    console.error('Get personal records error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching personal records'
    });
  }
};

// @desc    Get current PRs (best for each lift/rep combination)
// @route   GET /api/prs/current
// @access  Private
exports.getCurrentPRs = async (req, res) => {
  try {
    const currentPRs = await PersonalRecord.getCurrentPRs(req.user.id);

    // Group by lift for easier frontend consumption
    const groupedPRs = currentPRs.reduce((acc, pr) => {
      if (!acc[pr.lift]) {
        acc[pr.lift] = [];
      }
      acc[pr.lift].push(pr);
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      data: {
        currentPRs,
        groupedPRs
      }
    });
  } catch (error) {
    console.error('Get current PRs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching current PRs'
    });
  }
};

// @desc    Get best powerlifting total
// @route   GET /api/prs/best-total
// @access  Private
exports.getBestTotal = async (req, res) => {
  try {
    const bestLifts = await PersonalRecord.getBestLifts(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        bestLifts
      }
    });
  } catch (error) {
    console.error('Get best total error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching best total'
    });
  }
};

// @desc    Get PR history for specific lift
// @route   GET /api/prs/history/:lift
// @access  Private
exports.getPRHistory = async (req, res) => {
  try {
    const { reps = 1, limit = 10 } = req.query;
    const liftName = req.params.lift;

    const history = await PersonalRecord.getPRHistory(
      req.user.id, 
      liftName, 
      parseInt(reps)
    ).limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        lift: liftName,
        reps: parseInt(reps),
        history
      }
    });
  } catch (error) {
    console.error('Get PR history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching PR history'
    });
  }
};

// @desc    Create manual personal record
// @route   POST /api/prs
// @access  Private
exports.createPersonalRecord = async (req, res) => {
  try {
    const prData = {
      ...req.body,
      userId: req.user.id
    };

    // Validate required fields
    if (!prData.lift || !prData.weight || !prData.date) {
      return res.status(400).json({
        status: 'error',
        message: 'Lift, weight, and date are required'
      });
    }

    // Check if this is actually a PR
    const existingPR = await PersonalRecord.findOne({
      userId: req.user.id,
      lift: prData.lift,
      reps: prData.reps || 1,
      weight: { $gte: prData.weight },
      isActive: true
    });

    if (existingPR) {
      return res.status(400).json({
        status: 'error',
        message: 'This weight is not a personal record for this lift'
      });
    }

    const pr = await PersonalRecord.create(prData);

    res.status(201).json({
      status: 'success',
      data: {
        personalRecord: pr
      }
    });
  } catch (error) {
    console.error('Create personal record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating personal record'
    });
  }
};

// @desc    Update personal record
// @route   PUT /api/prs/:id
// @access  Private
exports.updatePersonalRecord = async (req, res) => {
  try {
    let pr = await PersonalRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!pr) {
      return res.status(404).json({
        status: 'error',
        message: 'Personal record not found'
      });
    }

    pr = await PersonalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        personalRecord: pr
      }
    });
  } catch (error) {
    console.error('Update personal record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating personal record'
    });
  }
};

// @desc    Delete personal record (soft delete)
// @route   DELETE /api/prs/:id
// @access  Private
exports.deletePersonalRecord = async (req, res) => {
  try {
    const pr = await PersonalRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!pr) {
      return res.status(404).json({
        status: 'error',
        message: 'Personal record not found'
      });
    }

    // Soft delete
    pr.isActive = false;
    await pr.save();

    res.status(200).json({
      status: 'success',
      message: 'Personal record deleted successfully'
    });
  } catch (error) {
    console.error('Delete personal record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting personal record'
    });
  }
};

// @desc    Get PR trends over time
// @route   GET /api/prs/trends/:lift
// @access  Private
exports.getPRTrends = async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const liftName = req.params.lift;

    const trends = await PersonalRecord.getPRTrends(
      req.user.id,
      liftName,
      parseInt(months)
    );

    // Calculate progress metrics
    const progressMetrics = calculateProgressMetrics(trends);

    res.status(200).json({
      status: 'success',
      data: {
        lift: liftName,
        trends,
        progressMetrics,
        period: {
          months: parseInt(months),
          startDate: trends[0]?.date,
          endDate: trends[trends.length - 1]?.date
        }
      }
    });
  } catch (error) {
    console.error('Get PR trends error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching PR trends'
    });
  }
};

// @desc    Get PR statistics and achievements
// @route   GET /api/prs/stats
// @access  Private
exports.getPRStats = async (req, res) => {
  try {
    const { period = 12 } = req.query; // months
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(period));

    // Get PR stats
    const stats = await PersonalRecord.aggregate([
      {
        $match: {
          userId: req.user.id,
          isActive: true,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalPRs: { $sum: 1 },
          trainingPRs: {
            $sum: { $cond: [{ $eq: ['$context', 'training'] }, 1, 0] }
          },
          competitionPRs: {
            $sum: { $cond: [{ $eq: ['$context', 'competition'] }, 1, 0] }
          },
          uniqueLifts: { $addToSet: '$lift' },
          avgWeight: { $avg: '$weight' },
          maxWeight: { $max: '$weight' },
          recentPRDate: { $max: '$date' }
        }
      }
    ]);

    // Get PR frequency by month
    const monthlyPRs = await PersonalRecord.aggregate([
      {
        $match: {
          userId: req.user.id,
          isActive: true,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get lift distribution
    const liftDistribution = await PersonalRecord.aggregate([
      {
        $match: {
          userId: req.user.id,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$lift',
          count: { $sum: 1 },
          maxWeight: { $max: '$weight' },
          latestDate: { $max: '$date' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: stats[0] || {
          totalPRs: 0,
          trainingPRs: 0,
          competitionPRs: 0,
          uniqueLifts: [],
          avgWeight: 0,
          maxWeight: 0,
          recentPRDate: null
        },
        monthlyPRs,
        liftDistribution,
        period: {
          months: parseInt(period),
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Get PR stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching PR statistics'
    });
  }
};

// @desc    Get recent PRs
// @route   GET /api/prs/recent
// @access  Private
exports.getRecentPRs = async (req, res) => {
  try {
    const { days = 30, limit = 10 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const recentPRs = await PersonalRecord.find({
      userId: req.user.id,
      isActive: true,
      date: { $gte: startDate }
    })
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .populate('competitionId', 'name date')
    .populate('workoutId', 'date');

    res.status(200).json({
      status: 'success',
      data: {
        recentPRs,
        period: {
          days: parseInt(days),
          startDate,
          endDate: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Get recent PRs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching recent PRs'
    });
  }
};

// @desc    Verify personal record
// @route   POST /api/prs/:id/verify
// @access  Private
exports.verifyPersonalRecord = async (req, res) => {
  try {
    const { verifiedBy, notes } = req.body;
    
    const pr = await PersonalRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!pr) {
      return res.status(404).json({
        status: 'error',
        message: 'Personal record not found'
      });
    }

    pr.isVerified = true;
    pr.verifiedBy = verifiedBy;
    if (notes) pr.notes = notes;
    
    await pr.save();

    res.status(200).json({
      status: 'success',
      data: {
        personalRecord: pr
      }
    });
  } catch (error) {
    console.error('Verify personal record error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error verifying personal record'
    });
  }
};

// Helper function to calculate progress metrics
function calculateProgressMetrics(trends) {
  if (trends.length < 2) {
    return {
      totalProgress: 0,
      monthlyAverage: 0,
      bestMonth: null,
      consistency: 0
    };
  }

  const first = trends[0];
  const last = trends[trends.length - 1];
  const totalProgress = last.estimatedOneRepMax - first.estimatedOneRepMax;
  
  // Calculate monthly progress
  const months = Math.abs(new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24 * 30);
  const monthlyAverage = months > 0 ? totalProgress / months : 0;

  // Find best progress month
  let bestProgress = 0;
  let bestMonth = null;
  
  for (let i = 1; i < trends.length; i++) {
    const progress = trends[i].estimatedOneRepMax - trends[i-1].estimatedOneRepMax;
    if (progress > bestProgress) {
      bestProgress = progress;
      bestMonth = new Date(trends[i].date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
  }

  // Calculate consistency (how often PRs were set)
  const totalMonths = Math.ceil(months);
  const consistency = totalMonths > 0 ? (trends.length / totalMonths) * 100 : 0;

  return {
    totalProgress: Math.round(totalProgress * 10) / 10,
    monthlyAverage: Math.round(monthlyAverage * 10) / 10,
    bestMonth,
    bestProgress: Math.round(bestProgress * 10) / 10,
    consistency: Math.min(100, Math.round(consistency))
  };
}
