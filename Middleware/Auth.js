const jwt = require('jsonwebtoken');
const User = require('../Models/Models'); // Make sure this path is correct

const SECRET = 'your_jwt_secret_key'; // Same secret used during token creation

// ✅ Middleware to verify token and attach full user object
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Authorization header missing or invalid');
    return res.status(401).json({ error: 'Please login to continue' });
  }

  const token = authHeader.split(' ')[1];

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
    const user = await User.findById(decoded.id); // Fetch full user

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user; // Attach full user object
    console.log('✅ Token verified for user:', user.email);
    next();
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

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
