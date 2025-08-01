const jwt = require('jsonwebtoken');

// 🔒 Use a hardcoded secret for now (good for dev/testing only)
const SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🛑 Missing or badly formatted Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ DEV: Allow hardcoded admin token to bypass JWT verification
  if (token === 'admin-token') {
    req.user = {
      isAdmin: true,
      username: 'admin',
      role: 'admin'
    };
    return next();
  }

  try {
    // ✅ Regular token verification
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 🛑 Invalid token (expired, bad signature, etc.)
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
