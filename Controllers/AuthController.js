const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Models');
const cloudinary = require('../Cloudinary');

// 🔐 Hardcoded JWT secret
const SECRET_KEY = 'your_jwt_secret_key';

// ✅ Register controller
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

// ✅ Login controller (admin + user)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 Hardcoded admin credentials
    const ADMIN_EMAIL = 'admin@liflow.com';
    const ADMIN_PASS = 'admin123';

    // ✅ Admin login
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

    // 🔁 Normal user login
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
      },
      isAdmin: false,
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
