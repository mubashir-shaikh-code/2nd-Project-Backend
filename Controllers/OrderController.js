const Order = require('../Models/Order');

exports.placeOrder = async (req, res) => {
  const { productId, price } = req.body;
  const userId = req.user._id; // ✅ Extracted from JWT

  try {
    const order = new Order({ user: userId, product: productId, price });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user._id; // ✅ Extracted from JWT

  try {
    const orders = await Order.find({ user: userId }).populate('product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product').populate('user');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
