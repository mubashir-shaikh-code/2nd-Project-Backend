const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  sendOtp,
  verifyOtp
} = require('../Controllers/AuthController');

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../Controllers/OrderController'); // ✅ separate file for orders

// ✅ Auth
router.post('/register', register);
router.post('/login', login);
router.get('/profile', getUserProfile);
router.put('/profile/update', updateUserProfile);
router.post('/reset-password', resetPassword);

// ✅ OTP
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// ✅ Orders
router.post('/orders/place', placeOrder);
router.get('/orders/user/:userId', getUserOrders);
router.get('/orders/all', getAllOrders);
router.put('/orders/update/:id', updateOrderStatus);

module.exports = router;
