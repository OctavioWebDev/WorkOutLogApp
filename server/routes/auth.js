// routes/auth.js
const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount
} = require('../controllers/authController');

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateChangePassword
} = require('../middleware/validation');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgotpassword', validateForgotPassword, forgotPassword);
router.put('/resetpassword/:resettoken', validateResetPassword, resetPassword);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.get('/logout', logout);
router.put('/profile', validateUpdateProfile, updateProfile);
router.put('/changepassword', validateChangePassword, changePassword);
router.delete('/account', deleteAccount);

module.exports = router;