// backend/otpverification/verifyOtp.js

const { getOtp, deleteOtp } = require('./OtpStore');

function verifyOtp(req, res) {
  const { email, otp: userOtp } = req.body;

  if (!email || !userOtp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const stored = getOtp(email);

  if (!stored) {
    return res.status(404).json({ success: false, message: 'No OTP found for this email' });
  }

  const { otp, createdAt } = stored;
  const now = Date.now();
  const expiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (now - createdAt > expiryTime) {
    deleteOtp(email);
    return res.status(410).json({ success: false, message: 'OTP has expired' });
  }

  if (userOtp !== otp) {
    return res.status(401).json({ success: false, message: 'Invalid OTP' });
  }

  deleteOtp(email); // Clean up after successful verification
  return res.status(200).json({ success: true, message: 'OTP verified successfully' });
}

module.exports = verifyOtp;
