const Delivery = require('../Models/Delivery');
const Product = require('../Models/Product');
const User = require('../Models/Models');

// ✅ Create single order (for individual product)
const createOrder = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const newOrder = new Delivery({ productId, userId });
    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// ✅ Create multiple orders from cart
const createCartOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const createdOrders = await Delivery.insertMany(
      orders.map(order => ({
        userId,
        productName: order.title,
        status: 'processing'
      }))
    );

    res.status(201).json(createdOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// ✅ Admin: Get all delivery orders with product & user info
const getAllOrders = async (req, res) => {
  try {
    const orders = await Delivery.find()
      .populate('productId', 'title')
      .populate('userId', 'username email');

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ✅ Get orders by user
const UserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Delivery.find({ userId }).populate('productId', 'title');
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};


// ✅ User: Get orders placed by the logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Delivery.find({ userId })
      .populate('productId', 'title');

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

// ✅ Admin: Update delivery status of an order
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Delivery.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json({ message: 'Status updated', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = {
  createOrder,
  createCartOrders,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  UserOrders
};
