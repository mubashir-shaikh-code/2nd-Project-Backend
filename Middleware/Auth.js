const jwt = require('jsonwebtoken');
const User = require('../Models/Models');

const SECRET = 'your_jwt_secret_key'; // Must match the secret used in token generation

// 🔐 General Token Verification
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Authorization header missing or invalid');
    return res.status(401).json({ error: 'Please login to continue' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ Hardcoded Admin Token (for testing)
  if (token === 'admin-token') {
    req.user = {
      isAdmin: true,
      username: 'admin',
      role: 'admin'
    };
    console.log('✅ Admin logged in using hardcoded token');
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('🔍 Decoded token payload:', decoded);

    if (!decoded.id) {
      console.log('❌ Token missing user ID');
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.id);
    console.log('🔍 Looking for user with ID:', decoded.id);

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    console.log(`✅ Token verified for user: ${user.username || user.email}`);
    next();
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// 🔐 Admin-Only Access Middleware
const verifyTokenAndAdmin = async (req, res, next) => {
  await verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      console.log('✅ Admin access granted');
      next();
    } else {
      console.log('❌ Admin access denied');
      return res.status(403).json({ error: 'Admin access only' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin
};
