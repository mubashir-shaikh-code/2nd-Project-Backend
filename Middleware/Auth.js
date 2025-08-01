const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = {
      _id: decoded._id,  // Ensure this matches what you store in the token
      email: decoded.email
    };
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;