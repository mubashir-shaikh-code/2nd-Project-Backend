const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../Controllers/OrderController');

const {
  verifyToken,
  verifyTokenAndAdmin
} = require('../Middleware/Auth'); // Adjust path if needed

// 🛒 Route: Place an order (User)
router.post('/place', verifyToken, placeOrder);

// 📦 Route: Get orders of logged-in user (User)
router.get('/user-orders', verifyToken, getUserOrders);

// 🔒 Route: Get all orders (Admin)
router.get('/all', verifyTokenAndAdmin, getAllOrders);

// 🔄 Route: Update order status (Admin)
router.put('/update/:orderId', verifyTokenAndAdmin, updateOrderStatus);

module.exports = router;
