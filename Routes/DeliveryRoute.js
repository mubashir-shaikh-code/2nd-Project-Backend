const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,     
  updateOrderStatus 
} = require('../Controllers/DeliveryController');
const verifyToken = require('../Middleware/verifyToken');

router.get('/my-orders', verifyToken, UserOrders);

// 🛒 Place order (user)
router.post('/place', verifyToken, createOrder);

// 📦 Admin: Get all orders
router.get('/all', getAllOrders);

// 📦 Admin: Update order status
router.put('/status/:id', updateOrderStatus);

module.exports = router;
