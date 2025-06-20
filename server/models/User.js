// models/User.js - Updated with enhanced Stripe fields
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  
  // Powerlifting Profile
  weightClass: {
    type: String,
    enum: ['52kg', '56kg', '60kg', '67.5kg', '75kg', '82.5kg', '90kg', '100kg', '110kg', '125kg', '140kg', '140kg+',
           '114lbs', '123lbs', '132lbs', '148lbs', '165lbs', '181lbs', '198lbs', '220lbs', '242lbs', '275lbs', '308lbs', '308lbs+']
  },
  federation: {
    type: String,
    enum: ['USAPL', 'IPF', 'USPA', 'IPL', 'RPS', 'SPF', 'WPC', 'CPU', 'Other']
  },
  experienceLevel: { 
    type: String, 
    enum: ['Novice', 'Intermediate', 'Advanced', 'Elite'],
    default: 'Novice'
  },
  
  // Enhanced Subscription & Billing
  subscriptionStatus: { 
    type: String, 
    enum: ['trial', 'active', 'past_due', 'cancelled', 'unpaid', 'expired'], 
    default: 'trial' 
  },
  subscriptionExpiry: Date,
  trialExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  
  // Stripe Integration
  stripeCustomerId: {
    type: String,
    sparse: true // Allows multiple null values
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true
  },
  
  // Billing Information
  billingInfo: {
    country: String,
    postalCode: String,
    taxId: String, // For business users
    lastPaymentDate: Date,
    nextBillingDate: Date,
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'yearly'
    }
  },
  
  // Payment History
  paymentHistory: [{
    amount: Number,
    currency: { type: String, default: 'usd' },
    status: { type: String, enum: ['succeeded', 'failed', 'pending'] },
    date: Date,
    invoiceId: String,
    description: String
  }],
  
  // Subscription Preferences
  subscriptionPreferences: {
    autoRenew: { type: Boolean, default: true },
    emailNotifications: {
      billingReminders: { type: Boolean, default: true },
      trialExpiry: { type: Boolean, default: true },
      paymentFailed: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: true }
    },
    currency: { type: String, default: 'usd' }
  },
  
  // Trial & Onboarding
  trialInfo: {
    hasUsedTrial: { type: Boolean, default: false },
    trialStartDate: Date,
    trialConvertedDate: Date,
    trialSource: String, // e.g., 'website', 'referral', 'social'
  },
  
  // Account Management
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'pending_deletion'],
    default: 'active'
  },
  
  // Settings
  preferredUnits: { 
    type: String, 
    enum: ['lbs', 'kg'], 
    default: 'lbs' 
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  },
  
  // Features & Permissions
  features: {
    workoutTracking: { type: Boolean, default: true },
    competitionManagement: { type: Boolean, default: true },
    goalSetting: { type: Boolean, default: true },
    analytics: { type: Boolean, default: true },
    dataExport: { type: Boolean, default: true },
    prioritySupport: { type: Boolean, default: false }
  },
  
  // Usage Tracking
  usage: {
    lastActiveDate: Date,
    totalWorkouts: { type: Number, default: 0 },
    totalCompetitions: { type: Number, default: 0 },
    totalPRs: { type: Number, default: 0 },
    dataExports: { type: Number, default: 0 },
    accountCreationSource: String // e.g., 'organic', 'referral', 'advertisement'
  },
  
  // Metadata
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ stripeCustomerId: 1 }, { sparse: true });
userSchema.index({ stripeSubscriptionId: 1 }, { sparse: true });
userSchema.index({ subscriptionStatus: 1 });
userSchema.index({ subscriptionExpiry: 1 });
userSchema.index({ trialExpiry: 1 });
userSchema.index({ createdAt: -1 });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update lastLogin and updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (!this.isNew && this.isModified()) {
    this.lastLogin = Date.now();
  }
  
  next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Enhanced subscription checking method
userSchema.methods.hasActiveSubscription = function() {
  const now = new Date();
  
  // Check if on active paid subscription
  if (this.subscriptionStatus === 'active' && this.subscriptionExpiry > now) {
    return true;
  }
  
  // Check if on valid trial
  if (this.subscriptionStatus === 'trial' && this.trialExpiry > now) {
    return true;
  }
  
  // Check if subscription is past due but still within grace period (7 days)
  if (this.subscriptionStatus === 'past_due' && this.subscriptionExpiry) {
    const gracePeriodEnd = new Date(this.subscriptionExpiry.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (now <= gracePeriodEnd) {
      return true;
    }
  }
  
  return false;
};

// Method to check if user can access premium features
userSchema.methods.canAccessPremiumFeatures = function() {
  return this.hasActiveSubscription() && this.accountStatus === 'active';
};

// Method to get subscription days remaining
userSchema.methods.getDaysRemaining = function() {
  const now = new Date();
  
  if (this.subscriptionStatus === 'trial' && this.trialExpiry > now) {
    return Math.ceil((this.trialExpiry - now) / (1000 * 60 * 60 * 24));
  }
  
  if (this.subscriptionStatus === 'active' && this.subscriptionExpiry > now) {
    return Math.ceil((this.subscriptionExpiry - now) / (1000 * 60 * 60 * 24));
  }
  
  return 0;
};

// Method to check if trial has expired
userSchema.methods.isTrialExpired = function() {
  return this.subscriptionStatus === 'trial' && this.trialExpiry <= new Date();
};

// Method to check if subscription needs renewal
userSchema.methods.needsRenewal = function() {
  const now = new Date();
  const warningPeriod = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  if (this.subscriptionStatus === 'trial' && this.trialExpiry <= warningPeriod) {
    return true;
  }
  
  if (this.subscriptionStatus === 'active' && this.subscriptionExpiry <= warningPeriod) {
    return true;
  }
  
  return ['past_due', 'unpaid', 'cancelled'].includes(this.subscriptionStatus);
};

// Method to update usage statistics
userSchema.methods.incrementUsage = function(metric, amount = 1) {
  if (!this.usage[metric]) {
    this.usage[metric] = 0;
  }
  this.usage[metric] += amount;
  this.usage.lastActiveDate = new Date();
  return this.save({ validateBeforeSave: false });
};

// Method to add payment to history
userSchema.methods.addPaymentHistory = function(paymentData) {
  this.paymentHistory.push({
    amount: paymentData.amount,
    currency: paymentData.currency || 'usd',
    status: paymentData.status,
    date: paymentData.date || new Date(),
    invoiceId: paymentData.invoiceId,
    description: paymentData.description || 'Powerlifting Tracker Subscription'
  });
  
  // Keep only last 50 payments
  if (this.paymentHistory.length > 50) {
    this.paymentHistory = this.paymentHistory.slice(-50);
  }
  
  return this.save({ validateBeforeSave: false });
};

// Virtual for full profile completion
userSchema.virtual('profileComplete').get(function() {
  const requiredFields = ['name', 'email', 'weightClass', 'federation', 'experienceLevel'];
  const completedFields = requiredFields.filter(field => this[field]);
  return Math.round((completedFields.length / requiredFields.length) * 100);
});

// Virtual for account health score
userSchema.virtual('accountHealthScore').get(function() {
  let score = 0;
  
  // Active subscription or trial
  if (this.hasActiveSubscription()) score += 40;
  
  // Email verified
  if (this.isEmailVerified) score += 20;
  
  // Profile complete
  if (this.profileComplete === 100) score += 20;
  
  // Recent activity (last 30 days)
  if (this.usage.lastActiveDate && 
      new Date() - this.usage.lastActiveDate < 30 * 24 * 60 * 60 * 1000) {
    score += 20;
  }
  
  return score;
});

// Static method to find users with expiring trials
userSchema.statics.findExpiringTrials = function(days = 3) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  return this.find({
    subscriptionStatus: 'trial',
    trialExpiry: { $lte: expiryDate, $gt: new Date() },
    isActive: true
  });
};

// Static method to find users with expiring subscriptions
userSchema.statics.findExpiringSubscriptions = function(days = 7) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  return this.find({
    subscriptionStatus: 'active',
    subscriptionExpiry: { $lte: expiryDate, $gt: new Date() },
    isActive: true
  });
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);