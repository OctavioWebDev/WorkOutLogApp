// controllers/competitionController.js
const { Competition, PersonalRecord, WeeklyOverview } = require('../models');

// @desc    Get all competitions for user
// @route   GET /api/competitions
// @access  Private
exports.getCompetitions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      upcoming,
      year,
      federation
    } = req.query;

    // Build query
    const query = { userId: req.user.id };
    
    if (status) {
      query.registrationStatus = status;
    }
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.registrationStatus = { $ne: 'Cancelled' };
    }
    
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);
      query.date = { $gte: startOfYear, $lte: endOfYear };
    }
    
    if (federation) {
      query.federation = federation;
    }

    // Execute query with pagination
    const competitions = await Competition.find(query)
      .sort({ date: upcoming === 'true' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Competition.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: competitions.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        competitions
      }
    });
  } catch (error) {
    console.error('Get competitions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching competitions'
    });
  }
};

// @desc    Get single competition
// @route   GET /api/competitions/:id
// @access  Private
exports.getCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        competition
      }
    });
  } catch (error) {
    console.error('Get competition error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching competition'
    });
  }
};

// @desc    Create new competition
// @route   POST /api/competitions
// @access  Private
exports.createCompetition = async (req, res) => {
  try {
    const competitionData = {
      ...req.body,
      userId: req.user.id
    };

    const competition = await Competition.create(competitionData);

    res.status(201).json({
      status: 'success',
      data: {
        competition
      }
    });
  } catch (error) {
    console.error('Create competition error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating competition'
    });
  }
};

// @desc    Update competition
// @route   PUT /api/competitions/:id
// @access  Private
exports.updateCompetition = async (req, res) => {
  try {
    let competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    competition = await Competition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // If competition results were updated and competition is completed, create PRs
    if (req.body.results && competition.isCompleted) {
      await createCompetitionPRs(competition);
    }

    res.status(200).json({
      status: 'success',
      data: {
        competition
      }
    });
  } catch (error) {
    console.error('Update competition error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating competition'
    });
  }
};

// @desc    Delete competition
// @route   DELETE /api/competitions/:id
// @access  Private
exports.deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    await competition.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Competition deleted successfully'
    });
  } catch (error) {
    console.error('Delete competition error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting competition'
    });
  }
};

// @desc    Get upcoming competitions
// @route   GET /api/competitions/upcoming
// @access  Private
exports.getUpcomingCompetitions = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    
    const competitions = await Competition.getUpcomingCompetitions(
      req.user.id, 
      parseInt(days)
    );

    res.status(200).json({
      status: 'success',
      data: {
        competitions,
        period: {
          days: parseInt(days),
          startDate: new Date(),
          endDate: new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000)
        }
      }
    });
  } catch (error) {
    console.error('Get upcoming competitions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching upcoming competitions'
    });
  }
};

// @desc    Get competition history
// @route   GET /api/competitions/history
// @access  Private
exports.getCompetitionHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const history = await Competition.getCompetitionHistory(
      req.user.id,
      parseInt(limit)
    );

    res.status(200).json({
      status: 'success',
      data: {
        history
      }
    });
  } catch (error) {
    console.error('Get competition history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching competition history'
    });
  }
};

// @desc    Get competition statistics
// @route   GET /api/competitions/stats
// @access  Private
exports.getCompetitionStats = async (req, res) => {
  try {
    const stats = await Competition.getCompetitionStats(req.user.id);
    
    // Get additional insights
    const federationStats = await Competition.aggregate([
      { $match: { userId: req.user.id, isCompleted: true } },
      {
        $group: {
          _id: '$federation',
          count: { $sum: 1 },
          avgTotal: { $avg: '$results.total' },
          bestTotal: { $max: '$results.total' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const yearlyProgress = await Competition.aggregate([
      { $match: { userId: req.user.id, isCompleted: true } },
      {
        $group: {
          _id: { $year: '$date' },
          competitions: { $sum: 1 },
          avgTotal: { $avg: '$results.total' },
          bestTotal: { $max: '$results.total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overall: stats,
        byFederation: federationStats,
        yearlyProgress
      }
    });
  } catch (error) {
    console.error('Get competition stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching competition statistics'
    });
  }
};

// @desc    Get suggested attempts based on current PRs
// @route   GET /api/competitions/:id/suggest-attempts
// @access  Private
exports.getSuggestedAttempts = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    const suggestions = await competition.suggestAttempts();

    res.status(200).json({
      status: 'success',
      data: {
        suggestions,
        competition: {
          name: competition.name,
          date: competition.date,
          goalTotal: competition.goalTotal
        }
      }
    });
  } catch (error) {
    console.error('Get suggested attempts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating attempt suggestions'
    });
  }
};

// @desc    Update planned attempts
// @route   PUT /api/competitions/:id/attempts
// @access  Private
exports.updatePlannedAttempts = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    // Update planned attempts
    competition.plannedAttempts = {
      ...competition.plannedAttempts,
      ...req.body
    };

    await competition.save();

    res.status(200).json({
      status: 'success',
      data: {
        competition
      }
    });
  } catch (error) {
    console.error('Update planned attempts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating planned attempts'
    });
  }
};

// @desc    Record competition results
// @route   PUT /api/competitions/:id/results
// @access  Private
exports.recordResults = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    // Update results
    competition.results = {
      ...competition.results,
      ...req.body
    };

    // Mark as completed if results are being recorded
    if (!competition.isCompleted) {
      competition.isCompleted = true;
      competition.registrationStatus = 'Completed';
    }

    await competition.save();

    // Create personal records from competition results
    const newPRs = await createCompetitionPRs(competition);

    res.status(200).json({
      status: 'success',
      data: {
        competition,
        newPRs
      }
    });
  } catch (error) {
    console.error('Record results error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error recording competition results'
    });
  }
};

// @desc    Complete competition with reflection
// @route   POST /api/competitions/:id/complete
// @access  Private
exports.completeCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    // Update reflection
    if (req.body.reflection) {
      competition.reflection = {
        ...competition.reflection,
        ...req.body.reflection
      };
    }

    // Mark as completed
    competition.isCompleted = true;
    competition.registrationStatus = 'Completed';

    await competition.save();

    res.status(200).json({
      status: 'success',
      data: {
        competition
      }
    });
  } catch (error) {
    console.error('Complete competition error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error completing competition'
    });
  }
};

// @desc    Get competition preparation timeline
// @route   GET /api/competitions/:id/timeline
// @access  Private
exports.getPreparationTimeline = async (req, res) => {
  try {
    const competition = await Competition.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found'
      });
    }

    // Generate timeline milestones
    const timeline = generatePreparationTimeline(competition);

    res.status(200).json({
      status: 'success',
      data: {
        timeline,
        competition: {
          name: competition.name,
          date: competition.date,
          daysUntilCompetition: competition.daysUntilCompetition,
          prepPhase: competition.prepPhase
        }
      }
    });
  } catch (error) {
    console.error('Get preparation timeline error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching preparation timeline'
    });
  }
};

// Helper function to create PRs from competition results
async function createCompetitionPRs(competition) {
  const newPRs = [];
  
  try {
    if (!competition.results) return newPRs;

    const lifts = ['squat', 'bench', 'deadlift'];
    
    for (const lift of lifts) {
      const liftResults = competition.results[lift];
      if (!liftResults || !liftResults.best) continue;

      // Check if this is a PR
      const existingPR = await PersonalRecord.findOne({
        userId: competition.userId,
        lift: lift.charAt(0).toUpperCase() + lift.slice(1), // Capitalize
        reps: 1,
        weight: { $gte: liftResults.best },
        isActive: true
      });

      if (!existingPR) {
        // Create new PR
        const pr = await PersonalRecord.create({
          userId: competition.userId,
          lift: lift.charAt(0).toUpperCase() + lift.slice(1),
          weight: liftResults.best,
          reps: 1,
          date: competition.date,
          context: 'competition',
          competitionId: competition._id,
          competitionName: competition.name,
          bodyWeight: competition.results.actualBodyWeight,
          notes: `Competition PR at ${competition.name}`
        });
        
        newPRs.push(pr);
      }
    }
  } catch (error) {
    console.error('Error creating competition PRs:', error);
  }
  
  return newPRs;
}

// Helper function to generate preparation timeline
function generatePreparationTimeline(competition) {
  if (!competition.prepStartDate || !competition.date) {
    return [];
  }

  const timeline = [];
  const prepStart = new Date(competition.prepStartDate);
  const compDate = new Date(competition.date);
  const totalWeeks = competition.prepWeeks || 12;
  
  // Calculate key milestones
  const milestones = [
    {
      week: 1,
      phase: 'Base Building',
      title: 'Meet Prep Begins',
      description: 'Start focused preparation, establish baselines',
      date: new Date(prepStart)
    },
    {
      week: Math.floor(totalWeeks * 0.25),
      phase: 'Base Building',
      title: 'Volume Peak',
      description: 'Highest training volume, technique refinement',
      date: new Date(prepStart.getTime() + (totalWeeks * 0.25 * 7 * 24 * 60 * 60 * 1000))
    },
    {
      week: Math.floor(totalWeeks * 0.5),
      phase: 'Strength',
      title: 'Strength Phase',
      description: 'Transition to heavier weights, lower volume',
      date: new Date(prepStart.getTime() + (totalWeeks * 0.5 * 7 * 24 * 60 * 60 * 1000))
    },
    {
      week: Math.floor(totalWeeks * 0.75),
      phase: 'Intensity',
      title: 'Intensity Phase',
      description: 'Practice competition commands, opener work',
      date: new Date(prepStart.getTime() + (totalWeeks * 0.75 * 7 * 24 * 60 * 60 * 1000))
    },
    {
      week: totalWeeks - 2,
      phase: 'Peak',
      title: 'Peak Week',
      description: 'Final heavy attempts, deload begins',
      date: new Date(compDate.getTime() - (14 * 24 * 60 * 60 * 1000))
    },
    {
      week: totalWeeks - 1,
      phase: 'Competition',
      title: 'Competition Week',
      description: 'Light openers, travel preparation',
      date: new Date(compDate.getTime() - (7 * 24 * 60 * 60 * 1000))
    },
    {
      week: totalWeeks,
      phase: 'Competition',
      title: 'Competition Day',
      description: competition.name,
      date: new Date(compDate)
    }
  ];

  // Add current status to each milestone
  const today = new Date();
  milestones.forEach(milestone => {
    milestone.status = milestone.date <= today ? 'completed' : 
                     milestone.date <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) ? 'current' : 
                     'upcoming';
    milestone.daysFromNow = Math.ceil((milestone.date - today) / (1000 * 60 * 60 * 24));
  });

  return milestones;
}