// models/index.js - Updated with all workout tracking models
const User = require('./User');
const AnnualGoals = require('./AnnualGoals');
const Competition = require('./Competition');
const WeeklyOverview = require('./WeeklyOverview');
const Workout = require('./Workout');
const PersonalRecord = require('./PersonalRecord');
const AnnualReview = require('./AnnualReview');

module.exports = {
  User,
  AnnualGoals,
  Competition,
  WeeklyOverview,
  Workout,
  PersonalRecord,
  AnnualReview
};