const Order = require('../Models/Order');

// ✅ Place a new order
const placeOrder = async (req, res) => {
  try {
    const { productId, price } = req.body;

    if (!productId || !price) {
      return res.status(400).json({ error: 'Missing productId or price' });
    }

    const userId = req.user._id;

    const order = new Order({
      product: productId, 
      price,
      user: userId
    });

    await order.save();
    console.log('✅ Order placed:', order);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('❌ Order placement failed:', err.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// ✅ Get orders for logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId }).populate('product');
    res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch user orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

// ✅ Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product').populate('user');
    res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch all orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

// ✅ Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status value' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('✅ Order status updated:', order);
    res.status(200).json(order);
  } catch (err) {
    console.error('❌ Failed to update order status:', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// PATCH /api/orders/cancel/:orderId
const requestOrderCancellation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optional: Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    order.cancelRequest = true;
    await order.save();

    res.status(200).json({ message: 'Cancellation request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /api/orders/cancel/approve/:orderId
const approveOrderCancellation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optional: Check if cancellation was requested
    if (!order.cancelRequest) {
      return res.status(400).json({ message: 'No cancellation request found for this order' });
    }

    order.cancelApproved = true;
    await order.save();

    res.status(200).json({ message: 'Order cancellation approved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestOrderCancellation,
  approveOrderCancellation
};
