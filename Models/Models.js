const mongoose = require('mongoose');

// 🔹 User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String }, // Optional: base64 or file path
});

const User = mongoose.model('User', userSchema);

// 🔹 Order Schema
const orderSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  price: Number,
  userId: String,
  userName: String,
  status: {
    type: String,
    enum: ['Processing', 'Dispatched', 'Delivered'],
    default: 'Processing',
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

// 🔹 Export all models
module.exports = { User, Order };
