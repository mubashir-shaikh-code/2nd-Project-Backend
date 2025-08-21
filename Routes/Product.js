const express = require("express");
const router = express.Router();

// ✅ Middleware
const { verifyToken, verifyTokenAndAdmin } = require("../Middleware/Auth");

// ✅ Controllers
const {
  getAllProducts,
  postProduct,
  approveProduct,
  rejectProduct,
  getUserProducts,
  getPendingProducts,
  updateProduct,
  deleteProduct,

  // 🔹 Review controllers
  addReview,
  getProductReviews,
} = require("../Controllers/ProductController");

// =============================
// 🔹 Product Routes
// =============================

// Public - anyone can view approved products
router.get("/", getAllProducts);

// Authenticated user routes
router.get("/user", verifyToken, getUserProducts);
router.post("/", verifyToken, postProduct);

// Admin routes
router.get("/pending", verifyTokenAndAdmin, getPendingProducts);
router.patch("/approve/:id", verifyTokenAndAdmin, approveProduct);
router.patch("/reject/:id", verifyTokenAndAdmin, rejectProduct);

// Authenticated user can edit/delete own product
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

// =============================
// 🔹 Review Routes
// =============================

// ✅ User can add a review to a product
router.post("/:productId/reviews", verifyToken, (req, res) => {
  // merge productId from params into body for controller
  req.body.productId = req.params.productId;
  addReview(req, res);
});

// ✅ Anyone can see reviews of a product
router.get("/:productId/reviews", getProductReviews);

module.exports = router;
