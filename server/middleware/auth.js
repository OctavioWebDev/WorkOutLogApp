// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'No user found with this token'
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is deactivated'
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error in authentication'
    });
  }
};

// Require active subscription
exports.requireSubscription = async (req, res, next) => {
  try {
    if (!req.user.hasActiveSubscription()) {
      return res.status(403).json({
        status: 'error',
        message: 'Active subscription required to access this feature',
        subscriptionStatus: req.user.subscriptionStatus,
        trialExpiry: req.user.trialExpiry,
        subscriptionExpiry: req.user.subscriptionExpiry
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error checking subscription'
    });
  }
};

// Check if user owns resource
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
      } catch (err) {
        // Token invalid, but continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};