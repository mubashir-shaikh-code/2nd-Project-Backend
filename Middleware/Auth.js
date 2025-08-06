const jwt = require('jsonwebtoken');

// ✅ Use a secure environment variable in production
const SECRET = 'your_jwt_secret_key'; // Change to process.env.JWT_SECRET in production

// ✅ Middleware to verify token for any user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Bearer token found in Authorization header');
    return res.status(401).json({ error: 'Please login to continue' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // decoded includes isAdmin and id from token
    console.log('✅ Token verified:', decoded);
    next();
  } catch (err) {
    console.log('❌ JWT Verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ✅ Middleware to verify token and check admin access
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
