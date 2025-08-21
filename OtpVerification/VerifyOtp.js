const { getOtp, deleteOtp } = require('./otpstore');

async function verifyOtp(req, res) {
  const { email, otp: userOtp } = req.body;

  if (!email || !userOtp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    // Fetch latest OTP
    const otpEntry = await getOtp(email);

    if (!otpEntry) {
      return res.status(404).json({ success: false, message: 'No OTP found for this email' });
    }

    const now = new Date();

    if (now > otpEntry.expiresAt) {
      await deleteOtp(email); // clean expired OTP
      return res.status(410).json({ success: false, message: 'OTP has expired' });
    }

    if (userOtp !== otpEntry.otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP is valid → delete it
    await deleteOtp(email);

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });

  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    return res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
}

module.exports = verifyOtp;
