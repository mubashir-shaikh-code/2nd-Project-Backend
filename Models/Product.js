const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    userEmail: { type: String, required: true },
    category: { type: String, required: true },

    // ✅ NEW FIELD: approval status
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
