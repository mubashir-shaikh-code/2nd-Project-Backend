const express = require('express');
const router = express.Router();
const {
  register,
  login,
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../Controllers/AuthController');

// ✅ Auth
router.post('/register', register);
router.post('/login', login);

// ✅ Orders
router.post('/orders/place', placeOrder);
router.get('/orders/user/:userId', getUserOrders);
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

module.exports = router;
