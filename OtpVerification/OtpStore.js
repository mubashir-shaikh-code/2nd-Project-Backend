const otpStore = new Map();

function saveOtp(email, otp) {
  otpStore.set(email, { otp, createdAt: Date.now() });
}

function getOtp(email) {
  return otpStore.get(email);
}

function deleteOtp(email) {
  otpStore.delete(email);
}

module.exports = { saveOtp, getOtp, deleteOtp };
