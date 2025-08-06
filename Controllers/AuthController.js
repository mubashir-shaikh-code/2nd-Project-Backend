const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Models');
const cloudinary = require('../Cloudinary');

const SECRET_KEY = 'your_jwt_secret_key'; // ✅ Keep this as-is

// ✅ Register controller (no changes needed here)
const register = async (req, res) => {
  // ... unchanged ...
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
        username: user.username, // ✅ Add this
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

module.exports = { register, login };
