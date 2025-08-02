const mongoose = require('mongoose');


const deliverySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'dispatched', 'delivered'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
