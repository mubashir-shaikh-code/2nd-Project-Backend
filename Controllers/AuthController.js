const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Models');
const cloudinary = require('../Cloudinary');

const SECRET_KEY = 'your_jwt_secret_key';

// User Registration
const register = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

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
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: '60s' } // Set expiry to 60 seconds
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
