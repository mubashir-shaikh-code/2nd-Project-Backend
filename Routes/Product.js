const express = require('express');
const router = express.Router();
const { getAllProducts, postProduct } = require('../Controllers/ProductController');

router.get('/', getAllProducts);
router.post('/', postProduct);
router.get('/approved', getApprovedProducts);
router.get('/pending', getPendingProducts); // admin only
router.put('/approve/:productId', approveProduct); // admin only


module.exports = router;
