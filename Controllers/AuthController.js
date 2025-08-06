const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Order } = require('../Models/Models');
const cloudinary = require('../Cloudinary');

const SECRET_KEY = 'your_jwt_secret_key';

// ✅ Register
const register = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let uploadedProfilePic = '';
    if (profilePic) {
      const uploadRes = await cloudinary.uploader.upload(profilePic, {
        folder: 'profiles',
      });
      uploadedProfilePic = uploadRes.secure_url;
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: uploadedProfilePic,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = 'admin@liflow.com';
    const ADMIN_PASS = 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const token = jwt.sign(
        { email, role: 'admin', isAdmin: true },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Admin login successful',
        token,
        user: {
          username: 'Admin',
          email,
          profilePic: null,
        },
        isAdmin: true,
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        id: user._id,
      },
      isAdmin: false,
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};



// 🟦 Place order (called when user clicks 'Place Order')
const placeOrder = async (req, res) => {
  try {
    const orders = req.body; // should be an array of product objects
    const newOrders = await Order.insertMany(orders);
    res.status(201).json(newOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟦 Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟦 Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟦 Update delivery status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
