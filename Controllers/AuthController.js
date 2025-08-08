const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Models');
const cloudinary = require('../Cloudinary');

const SECRET_KEY = 'your_jwt_secret_key'; // ✅ Keep this as-is

// ✅ Register controller
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Register Error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = 'admin@liflow.com';
    const ADMIN_PASS = 'admin123';

    // ✅ Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const token = jwt.sign(
        {
          email,
          username: 'Admin',
          role: 'admin',
          isAdmin: true,
        },
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

    // ✅ Normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
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
      },
      isAdmin: user.isAdmin || false,
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Profile Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// ✅ Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = req.body.username || user.username;
    user.profilePic = req.body.profilePic || user.profilePic;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (err) {
    console.error('❌ Profile Update Error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
};
