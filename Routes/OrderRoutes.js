const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestOrderCancellation,
  approveOrderCancellation
} = require('../Controllers/OrderController');

const { verifyToken, verifyTokenAndAdmin,admin } = require('../Middleware/Auth'); // ✅ Your JWT middleware

// ✅ User places an order
router.post('/place', verifyToken, placeOrder);

// ✅ User views their orders
router.get('/user', verifyToken, getUserOrders);

// ✅ Admin views all orders
router.get('/admin', verifyTokenAndAdmin, getAllOrders);

// ✅ Admin updates order status
router.put('/admin/:orderId', verifyTokenAndAdmin, updateOrderStatus);

// User requests cancellation
router.patch('/cancel/:orderId', requestOrderCancellation);

// Admin approves cancellation
router.patch('/cancel/approve/:orderId', admin, approveOrderCancellation);


module.exports = router;
