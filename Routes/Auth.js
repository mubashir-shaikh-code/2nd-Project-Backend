const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/AuthController');
const { getUserProfile, updateUserProfile } = require('../Controllers/AuthController');
const { verifyToken } = require('../Middleware/Auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Profile routes
router.route('/profile')
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateUserProfile);

module.exports = router;
