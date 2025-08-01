const express = require('express');
const router = express.Router();
const authenticateUser = require('../Middleware/Auth');

const {
  getAllProducts,
  postProduct,
  approveProduct,
  rejectProduct,
  getUserProducts,
  getPendingProducts,
  updateProduct,
  deleteProduct
} = require('../Controllers/ProductController');

// ✅ Get all approved products (visible to users on home page)
router.get('/', getAllProducts);

// ✅ Delete product
router.delete('/:id', deleteProduct);


// ✅ Get products of a specific user
router.get('/user',authenticateUser, getUserProducts);

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
