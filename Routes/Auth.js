const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/AuthController');
const { getUserProfile, updateUserProfile } = require('../Controllers/AuthController');
const { verifyToken } = require('../Middleware/Auth');
const sendOtp = require('../OtpVerification/SendOtp');
const verifyOtp = require('../OtpVerification/VerifyOtp');
const { resetPassword } = require('../Controllers/AuthController');

//reset password route
router.post('/reset-password', resetPassword);

//Otp Verification routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Profile routes
router.route('/profile')
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateUserProfile);

module.exports = router;
