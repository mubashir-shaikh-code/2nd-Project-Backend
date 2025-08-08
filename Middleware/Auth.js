const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret_key'; // Must match the secret used in token generation

// 🔐 General Token Verification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Authorization header missing or invalid');
    return res.status(401).json({ error: 'Please login to continue' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ Hardcoded Admin Token (for testing)
  if (token === 'admin-token') {
    req.user = {
      id: 'admin-id',
      isAdmin: true,
      username: 'admin',
      role: 'admin',
      email: 'admin@liflow.com'
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

    req.user = decoded; // ✅ Attach decoded payload (includes id, email, etc.)
    console.log(`✅ Token verified for user: ${decoded.username || decoded.email}`);
    next();
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// 🔐 Admin-Only Access Middleware (chained with verifyToken)
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

// 🔐 Standalone Admin Middleware (for use after verifyToken)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log('✅ Admin middleware passed');
    next();
  } else {
    console.log('❌ Admin middleware failed');
    return res.status(403).json({ error: 'Admin access only' });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  admin
};
