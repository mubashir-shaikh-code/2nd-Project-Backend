const express = require('express');
const router = express.Router();
const {verifyToken, verifyTokenAndAdmin}= require('../Middleware/Auth');

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

//  Public
router.get('/', getAllProducts);

//  Authenticated
router.get('/user', verifyToken, getUserProducts);
router.post('/', verifyToken, postProduct);
router.get('/pending', verifyToken, getPendingProducts);

//  Admin (you can add admin check inside controller or a separate middleware)
router.patch('/approve/:id', verifyTokenAndAdmin, approveProduct);
router.patch('/reject/:id', verifyTokenAndAdmin, rejectProduct);

//  Edit/Delete
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
