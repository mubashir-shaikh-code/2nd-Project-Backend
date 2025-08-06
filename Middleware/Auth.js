const jwt = require('jsonwebtoken');

// 🔐 Hardcoded JWT secret (Do NOT use in production)
const SECRET = 'your_jwt_secret_key'; // same secret used during token creation

// ✅ Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🛑 Authorization header missing or invalid
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Authorization header missing or invalid');
    return res.status(401).json({ error: 'Please login to continue' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ Allow hardcoded admin token bypass
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
    req.user = decoded;

    console.log('✅ Token verified for user:', decoded.username || decoded.email || decoded._id);
    next();
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ✅ Middleware to verify token and admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
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
