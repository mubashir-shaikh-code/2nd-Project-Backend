const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  UserOrders // ✅ FIXED: Now imported correctly
} = require('../Controllers/DeliveryController');
const verifyToken = require('../Middleware/Auth');

// 🛒 Place order (user)
router.post('/place', verifyToken, createOrder);

// 👤 User: Get logged-in user's orders
router.get('/my-orders', verifyToken, UserOrders);

// 📦 Admin: Get all orders
router.get('/all', getAllOrders);

// 📦 Admin: Update order status
router.put('/status/:id', updateOrderStatus);

module.exports = router;
