const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  postProduct,
  approveProduct,
  rejectProduct,
} = require('../Controllers/ProductController');

// ✅ Get all products (admin will see all; frontend filters status if needed)
router.get('/', getAllProducts);

// ✅ Post a new product
router.post('/', postProduct);

// ✅ Approve product (admin only)
router.patch('/approve/:id', approveProduct);

// ✅ Reject product (admin only)
router.patch('/reject/:id', rejectProduct);

module.exports = router;
