// backend/Routes/Admin.js
const express = require('express');
const router = express.Router();

const ADMIN_EMAIL = 'admin@liflow.com';
const ADMIN_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({ message: 'Admin login successful', isAdmin: true });
  }

  return res.status(401).json({ error: 'Invalid admin credentials' });
});

module.exports = router;
