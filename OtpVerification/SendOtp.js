// backend/otpverification/sendOtp.js

const generateOtp = require('./GenerateOtp');
const { saveOtp } = require('./OtpStore');
const sendEmail = require('./EmailSender');

async function sendOtp(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = generateOtp();
  saveOtp(email, otp);

  const subject = 'Your OTP Code';
  const message = `Your OTP is: ${otp}. It will expire in 5 minutes.`;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
}

module.exports = sendOtp;
