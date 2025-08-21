const db = require('../db');

// Save OTP in DB
async function saveOtp(email, otp, expiresAt) {
  await db.query(
    'INSERT INTO otps (email, otp, expiresAt) VALUES (?, ?, ?)',
    [email, otp, expiresAt]
  );
}

// Get latest OTP for email
async function getOtp(email) {
  const [rows] = await db.query(
    'SELECT * FROM otps WHERE email = ? ORDER BY createdAt DESC LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

// Delete OTPs for email
async function deleteOtp(email) {
  await db.query('DELETE FROM otps WHERE email = ?', [email]);
}

module.exports = { saveOtp, getOtp, deleteOtp };
