const jwt = require('jsonwebtoken');

// 🔐 Hardcoded JWT secret (dev only)
const SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🛑 Authorization header missing
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Bearer token found in Authorization header');
    return res.status(401).json({ error: 'Please login to place order' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ Allow hardcoded admin token bypass
  if (token === 'admin-token') {
    req.user = {
      isAdmin: true,
      username: 'admin',
      role: 'admin'
    };
    console.log('✅ Admin logged in using admin-token');
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    console.log('✅ Token verified, user:', decoded);
    next();
  } catch (err) {
    console.log('❌ JWT Verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
