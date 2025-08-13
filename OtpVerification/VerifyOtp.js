const OtpModel = require('../Models/Otp'); // Adjust path if needed

async function verifyOtp(req, res) {
  const { email, otp: userOtp } = req.body;

  if (!email || !userOtp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    // Find the latest OTP for this email
    const otpEntry = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpEntry) {
      return res.status(404).json({ success: false, message: 'No OTP found for this email' });
    }

    const now = new Date();

    if (now > otpEntry.expiresAt) {
      await OtpModel.deleteOne({ _id: otpEntry._id }); // Clean up expired OTP
      return res.status(410).json({ success: false, message: 'OTP has expired' });
    }

    if (userOtp !== otpEntry.otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP is valid — delete it and respond
    await OtpModel.deleteOne({ _id: otpEntry._id });

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
}

module.exports = verifyOtp;
