const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../Controllers/OrderController');

const { verifyToken, verifyTokenAndAdmin } = require('../middleware/authMiddleware'); // ✅ Your JWT middleware

// ✅ User places an order
router.post('/place', verifyToken, placeOrder);

// ✅ User views their orders
router.get('/user', verifyToken, getUserOrders);

// ✅ Admin views all orders
router.get('/admin', verifyTokenAndAdmin, getAllOrders);

// ✅ Admin updates order status
router.put('/admin/:orderId', verifyTokenAndAdmin, updateOrderStatus);

module.exports = router;
