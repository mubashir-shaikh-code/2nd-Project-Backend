const Order = require('../Models/Order');

// Place an order
const placeOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // ✅ FIXED

    const order = new Order({
      productId,
      userId,
      quantity,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Order placement failed', error: error.message });
  }
};

// Get orders of the logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED

    const orders = await Order.find({ userId }).populate('productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
};

// Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('productId userId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
  }
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('productId userId');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
