const generateOtp = require('./generateotp');
const { saveOtp } = require('./otpstore');
const sendEmail = require('./emailsender');

async function sendOtp(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiry

  try {
    // Save OTP in DB
    await saveOtp(email, otp, expiresAt);

    const subject = 'Your OTP Code';
    const message = `<p>Your OTP is: <b>${otp}</b>. It will expire in 1 minute.</p>`;

    // Send email
    await sendEmail(email, subject, message);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
}

module.exports = sendOtp;
