const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Processing', 'Dispatched', 'Delivered'],
    default: 'Processing',
  },
  cancelRequest: {
  type: Boolean,
  default: false
},
cancelApproved: {
  type: Boolean,
  default: false
}

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
