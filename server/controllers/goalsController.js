// controllers/goalsController.js
const { AnnualGoals, AnnualReview, PersonalRecord, Competition, Workout } = require('../models');

// ======================
// ANNUAL GOALS ENDPOINTS
// ======================

// @desc    Get annual goals for user
// @route   GET /api/goals
// @access  Private
exports.getAnnualGoals = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const goals = await AnnualGoals.findOne({
      userId: req.user.id,
      year: targetYear,
      isActive: true
    });

    if (!goals) {
      return res.status(404).json({
        status: 'error',
        message: `No goals found for ${targetYear}`
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        goals
      }
    });
  } catch (error) {
    console.error('Get annual goals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching annual goals'
    });
  }
};

// @desc    Create annual goals
// @route   POST /api/goals
// @access  Private
exports.createAnnualGoals = async (req, res) => {
  try {
    const goalsData = {
      ...req.body,
      userId: req.user.id
    };

    // Check if goals already exist for this year
    const existingGoals = await AnnualGoals.findOne({
      userId: req.user.id,
      year: goalsData.year,
      isActive: true
    });

    if (existingGoals) {
      return res.status(400).json({
        status: 'error',
        message: `Goals already exist for ${goalsData.year}`
      });
    }

    // Auto-populate starting maxes from current PRs
    const bestLifts = await PersonalRecord.getBestLifts(req.user.id);
    
    if (!goalsData.goals) goalsData.goals = {};
    
    ['squat', 'bench', 'deadlift'].forEach(lift => {
      if (bestLifts[lift] && !goalsData.goals[lift]?.startingMax) {
        if (!goalsData.goals[lift]) goalsData.goals[lift] = {};
        goalsData.goals[lift].startingMax = bestLifts[lift].weight;
        goalsData.goals[lift].current = bestLifts[lift].weight;
      }
    });

    // Calculate starting total
    if (bestLifts.total && !goalsData.goals.total?.startingTotal) {
      if (!goalsData.goals.total) goalsData.goals.total = {};
      goalsData.goals.total.startingTotal = bestLifts.total;
      goalsData.goals.total.current = bestLifts.total;
    }

    const goals = await AnnualGoals.create(goalsData);

    res.status(201).json({
      status: 'success',
      data: {
        goals
      }
    });
  } catch (error) {
    console.error('Create annual goals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating annual goals'
    });
  }
};

// @desc    Update annual goals
// @route   PUT /api/goals/:id
// @access  Private
exports.updateAnnualGoals = async (req, res) => {
  try {
    let goals = await AnnualGoals.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goals) {
      return res.status(404).json({
        status: 'error',
        message: 'Goals not found'
      });
    }

    goals = await AnnualGoals.findByIdAndUpdate(
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
        goals
      }
    });
  } catch (error) {
    console.error('Update annual goals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating annual goals'
    });
  }
};

// @desc    Get goal history
// @route   GET /api/goals/history
// @access  Private
exports.getGoalHistory = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const history = await AnnualGoals.getGoalHistory(req.user.id, parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        history
      }
    });
  } catch (error) {
    console.error('Get goal history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching goal history'
    });
  }
};

// @desc    Update current maxes from latest PRs
// @route   POST /api/goals/:id/update-maxes
// @access  Private
exports.updateCurrentMaxes = async (req, res) => {
  try {
    const goals = await AnnualGoals.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goals) {
      return res.status(404).json({
        status: 'error',
        message: 'Goals not found'
      });
    }

    await goals.updateCurrentMaxes();

    res.status(200).json({
      status: 'success',
      data: {
        goals
      }
    });
  } catch (error) {
    console.error('Update current maxes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating current maxes'
    });
  }
};

// @desc    Add monthly check-in
// @route   POST /api/goals/:id/checkin
// @access  Private
exports.addMonthlyCheckin = async (req, res) => {
  try {
    const goals = await AnnualGoals.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goals) {
      return res.status(404).json({
        status: 'error',
        message: 'Goals not found'
      });
    }

    await goals.addMonthlyCheckin(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        goals
      }
    });
  } catch (error) {
    console.error('Add monthly check-in error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding monthly check-in'
    });
  }
};

// @desc    Complete quarterly milestone
// @route   POST /api/goals/:id/quarter/:quarter/complete
// @access  Private
exports.completeQuarterlyMilestone = async (req, res) => {
  try {
    const { quarter } = req.params;
    const { actualResults, reflection } = req.body;

    const goals = await AnnualGoals.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goals) {
      return res.status(404).json({
        status: 'error',
        message: 'Goals not found'
      });
    }

    await goals.completeQuarterlyMilestone(quarter, actualResults, reflection);

    res.status(200).json({
      status: 'success',
      data: {
        goals
      }
    });
  } catch (error) {
    console.error('Complete quarterly milestone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error completing quarterly milestone'
    });
  }
};

// @desc    Get goal analytics and insights
// @route   GET /api/goals/analytics
// @access  Private
exports.getGoalAnalytics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get current goals
    const currentGoals = await AnnualGoals.getActiveGoals(req.user.id, currentYear);
    
    // Get achievement analysis
    const achievementAnalysis = await AnnualGoals.getAchievementAnalysis(req.user.id);
    
    // Get recent progress data
    const recentPRs = await PersonalRecord.find({
      userId: req.user.id,
      date: { $gte: new Date(currentYear, 0, 1) },
      isActive: true
    }).sort({ date: -1 }).limit(10);

    // Calculate goal projections
    let projections = null;
    if (currentGoals) {
      projections = calculateGoalProjections(currentGoals, recentPRs);
    }

    res.status(200).json({
      status: 'success',
      data: {
        currentGoals,
        achievementAnalysis,
        recentPRs,
        projections
      }
    });
  } catch (error) {
    console.error('Get goal analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching goal analytics'
    });
  }
};

// ======================
// ANNUAL REVIEW ENDPOINTS
// ======================

// @desc    Get annual review
// @route   GET /api/goals/review/:year
// @access  Private
exports.getAnnualReview = async (req, res) => {
  try {
    const { year } = req.params;
    
    const review = await AnnualReview.findOne({
      userId: req.user.id,
      year: parseInt(year)
    }).populate('annualGoalsId');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: `No review found for ${year}`
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Get annual review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching annual review'
    });
  }
};

// @desc    Create or update annual review
// @route   POST /api/goals/review/:year
// @access  Private
exports.createAnnualReview = async (req, res) => {
  try {
    const { year } = req.params;
    const targetYear = parseInt(year);
    
    // Find the annual goals for this year
    const annualGoals = await AnnualGoals.findOne({
      userId: req.user.id,
      year: targetYear,
      isActive: true
    });

    if (!annualGoals) {
      return res.status(404).json({
        status: 'error',
        message: `No annual goals found for ${year}. Create goals first.`
      });
    }

    // Generate or update review
    let review = await AnnualReview.findOne({
      userId: req.user.id,
      year: targetYear
    });

    if (review) {
      // Update existing review
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          review[key] = req.body[key];
        }
      });
      await review.save();
    } else {
      // Create new review
      review = await AnnualReview.generateReviewTemplate(
        req.user.id,
        targetYear,
        annualGoals._id
      );
      
      // Apply any provided data
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          review[key] = req.body[key];
        }
      });
      await review.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Create annual review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating annual review'
    });
  }
};

// @desc    Update annual review
// @route   PUT /api/goals/review/:year
// @access  Private
exports.updateAnnualReview = async (req, res) => {
  try {
    const { year } = req.params;
    
    let review = await AnnualReview.findOne({
      userId: req.user.id,
      year: parseInt(year)
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: `No review found for ${year}`
      });
    }

    // Deep merge the update data
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'object' && req.body[key] !== null && !Array.isArray(req.body[key])) {
        review[key] = { ...review[key], ...req.body[key] };
      } else {
        review[key] = req.body[key];
      }
    });

    await review.save();

    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Update annual review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating annual review'
    });
  }
};

// @desc    Get multi-year insights
// @route   GET /api/goals/insights
// @access  Private
exports.getMultiYearInsights = async (req, res) => {
  try {
    const insights = await AnnualReview.getMultiYearInsights(req.user.id);
    
    // Get goal history for context
    const goalHistory = await AnnualGoals.getGoalHistory(req.user.id, 10);
    
    res.status(200).json({
      status: 'success',
      data: {
        insights,
        goalHistory
      }
    });
  } catch (error) {
    console.error('Get multi-year insights error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching multi-year insights'
    });
  }
};

// @desc    Generate goal suggestions for next year
// @route   GET /api/goals/suggestions/:year
// @access  Private
exports.generateGoalSuggestions = async (req, res) => {
  try {
    const { year } = req.params;
    const targetYear = parseInt(year);
    
    // Get current year's progress
    const currentGoals = await AnnualGoals.findOne({
      userId: req.user.id,
      year: targetYear - 1,
      isActive: true
    });

    // Get recent performance data
    const recentPRs = await PersonalRecord.find({
      userId: req.user.id,
      date: { $gte: new Date(targetYear - 1, 0, 1) },
      isActive: true
    }).sort({ date: -1 });

    // Get latest maxes
    const bestLifts = await PersonalRecord.getBestLifts(req.user.id);

    const suggestions = generateGoalSuggestions(currentGoals, recentPRs, bestLifts);

    res.status(200).json({
      status: 'success',
      data: {
        suggestions,
        basedOnData: {
          currentGoals: currentGoals ? true : false,
          recentPRCount: recentPRs.length,
          bestLifts
        }
      }
    });
  } catch (error) {
    console.error('Generate goal suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating goal suggestions'
    });
  }
};

// Helper function to calculate goal projections
function calculateGoalProjections(goals, recentPRs) {
  const now = new Date();
  const yearStart = new Date(goals.year, 0, 1);
  const yearEnd = new Date(goals.year, 11, 31);
  const yearProgress = (now - yearStart) / (yearEnd - yearStart);
  
  const projections = {};
  
  ['squat', 'bench', 'deadlift', 'total'].forEach(lift => {
    const goalData = goals.goals[lift];
    if (!goalData || !goalData.target || !goalData.current) return;
    
    const currentProgress = goalData.current - goalData.startingMax;
    const targetProgress = goalData.target - goalData.startingMax;
    
    // Calculate current pace
    const currentPace = yearProgress > 0 ? currentProgress / yearProgress : 0;
    const projectedFinal = goalData.startingMax + (currentPace * 1); // Full year projection
    
    // Probability calculation based on current pace
    let probability = 'Unknown';
    const progressRatio = currentProgress / targetProgress;
    
    if (progressRatio >= 1) probability = 'Very High';
    else if (progressRatio >= 0.8) probability = 'High';
    else if (progressRatio >= 0.6) probability = 'Moderate';
    else if (progressRatio >= 0.4) probability = 'Low';
    else probability = 'Very Low';
    
    projections[lift] = {
      current: goalData.current,
      target: goalData.target,
      projectedFinal: Math.round(projectedFinal),
      progressNeeded: Math.round(goalData.target - goalData.current),
      timeRemaining: Math.round((1 - yearProgress) * 365),
      probability
    };
  });
  
  return projections;
}

// Helper function to generate goal suggestions
function generateGoalSuggestions(currentGoals, recentPRs, bestLifts) {
  const suggestions = {
    conservative: {},
    realistic: {},
    aggressive: {},
    reasoning: {}
  };
  
  ['squat', 'bench', 'deadlift'].forEach(lift => {
    const currentMax = bestLifts[lift]?.weight || 0;
    
    if (currentMax === 0) {
      suggestions.conservative[lift] = 0;
      suggestions.realistic[lift] = 0;
      suggestions.aggressive[lift] = 0;
      suggestions.reasoning[lift] = 'No current max available';
      return;
    }
    
    // Calculate recent progress rate
    const liftPRs = recentPRs.filter(pr => 
      pr.lift.toLowerCase().includes(lift.toLowerCase())
    );
    
    let progressRate = 0;
    if (liftPRs.length >= 2) {
      const oldestPR = liftPRs[liftPRs.length - 1];
      const newestPR = liftPRs[0];
      const timeSpan = (newestPR.date - oldestPR.date) / (1000 * 60 * 60 * 24 * 365); // years
      progressRate = timeSpan > 0 ? (newestPR.weight - oldestPR.weight) / timeSpan : 0;
    }
    
    // Base suggestions on current max and progress rate
    suggestions.conservative[lift] = Math.round(currentMax + Math.max(5, progressRate * 0.5));
    suggestions.realistic[lift] = Math.round(currentMax + Math.max(10, progressRate));
    suggestions.aggressive[lift] = Math.round(currentMax + Math.max(20, progressRate * 1.5));
    
    suggestions.reasoning[lift] = `Based on current max of ${currentMax}lbs and recent progress rate of ${Math.round(progressRate)}lbs/year`;
  });
  
  // Calculate total suggestions
  suggestions.conservative.total = suggestions.conservative.squat + suggestions.conservative.bench + suggestions.conservative.deadlift;
  suggestions.realistic.total = suggestions.realistic.squat + suggestions.realistic.bench + suggestions.realistic.deadlift;
  suggestions.aggressive.total = suggestions.aggressive.squat + suggestions.aggressive.bench + suggestions.aggressive.deadlift;
  
  return suggestions;
}