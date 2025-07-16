const express = require('express');
const router = express.Router();
const { getAllProducts, postProduct } = require('../Controllers/ProductController');

router.get('/', getAllProducts);
router.post('/', postProduct);

module.exports = router;
