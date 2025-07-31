const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  postProduct,
  approveProduct,
  rejectProduct,
  getUserProducts,
  getPendingProducts,
  updateProduct
} = require('../Controllers/ProductController');

// ✅ Get all approved products (visible to users on home page)
router.get('/', getAllProducts);

// ✅ Get products of a specific user
router.get('/products/user', getUserProducts);

// ✅ Get all pending products (only for admin panel)
router.get('/pending', getPendingProducts);

// ✅ Post a new product
router.post('/', postProduct);

// ✅ Approve product (admin only)
router.patch('/approve/:id', approveProduct);

// ✅ Reject product (admin only)
router.patch('/reject/:id', rejectProduct);

// ✅ Update product details
router.put('/:id', updateProduct);

module.exports = router;
