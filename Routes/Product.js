const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  postProduct,
  approveProduct,
  rejectProduct,
  updateProduct
} = require('../Controllers/ProductController');

// ✅ Get all approved products (visible to users on home page)
router.get('/', getAllProducts);

// ✅ Get all pending products (only for admin panel)
router.get('/pending', getAllProducts); // optional, keep if admin panel needs it

// ✅ Post a new product
router.post('/', postProduct);

// ✅ Approve product (admin only)
router.patch('/approve/:id', approveProduct);
router.put('/approve/:id', approveProduct);

// ✅ Update product details (optional, remove if not needed)
router.put('/:id', updateProduct);

// ✅ Reject product (admin only)
router.patch('/reject/:id', rejectProduct);

module.exports = router;
