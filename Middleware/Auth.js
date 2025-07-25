const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
