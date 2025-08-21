const express = require("express");
const router = express.Router();

// ✅ Controllers
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestOrderCancellation,
  approveOrderCancellation,
} = require("../Controllers/OrderController");

// ✅ Middleware
const { verifyToken, verifyTokenAndAdmin } = require("../Middleware/Auth");

// =============================
// 🔹 Order Routes
// =============================

// User places an order
router.post("/place", verifyToken, placeOrder);

// User views their orders
router.get("/user", verifyToken, getUserOrders);

// Admin views all orders
router.get("/admin", verifyTokenAndAdmin, getAllOrders);

// Admin updates order status
router.put("/admin/:orderId", verifyTokenAndAdmin, updateOrderStatus);

// User requests cancellation
router.patch("/cancel/:orderId", verifyToken, requestOrderCancellation);

// Admin approves cancellation
router.patch("/cancel/approve/:orderId", verifyTokenAndAdmin, approveOrderCancellation);

module.exports = router;
