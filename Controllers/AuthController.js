const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // ✅ MySQL connection
const cloudinary = require("../Cloudinary");

const generateOtp = require("../OtpVerification/generateotp");
const sendEmail = require("../OtpVerification/emailsender");
const { saveOtp, getOtp, deleteOtp } = require("../OtpVerification/otpstore");

// ✅ Use same secret key everywhere
const SECRET = "your_jwt_secret_key";

// =============================
// 🔹 Register (without OTP block here)
// =============================
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into MySQL
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// =============================
// 🔹 Login
// =============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin
    const ADMIN_EMAIL = "admin@liflow.com";
    const ADMIN_PASS = "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const token = jwt.sign(
        { id: "admin-id", email, username: "Admin", isAdmin: true },
        SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: { username: "Admin", email, profilePic: null },
        isAdmin: true,
      });
    }

    // Fetch user from MySQL
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // ✅ Generate JWT
   // when creating JWT
const token = jwt.sign(
  { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin },
  SECRET,
  { expiresIn: "7d" }
);


    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
      isAdmin: !!user.isAdmin,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// =============================
// 🔹 Get User Profile
// =============================
const getUserProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, email, profilePic, isAdmin FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// =============================
// 🔹 Update User Profile
// =============================
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, profilePic, password } = req.body;

    // Check if user exists
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    // Check email uniqueness
    if (email && email !== user.email) {
      const [emailRows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (emailRows.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Hash new password if provided
    let newPassword = user.password;
    if (password && password.trim() !== "") {
      newPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    await db.query(
      "UPDATE users SET username = ?, email = ?, profilePic = ?, password = ? WHERE id = ?",
      [
        username || user.username,
        email || user.email,
        profilePic || user.profilePic,
        newPassword,
        req.user.id,
      ]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// =============================
// 🔹 Reset Password
// =============================
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Email and new password are required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

// =============================
// 🔹 Send OTP
// =============================
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry

  try {
    await saveOtp(email, otp, expiresAt);

    const subject = "Your OTP Code";
    const message = `<p>Your OTP is: <b>${otp}</b>. It will expire in 1 minute.</p>`;

    await sendEmail(email, subject, message);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// =============================
// 🔹 Verify OTP
// =============================
const verifyOtp = async (req, res) => {
  const { email, otp: userOtp } = req.body;

  if (!email || !userOtp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const otpEntry = await getOtp(email);

    if (!otpEntry) {
      return res.status(404).json({ success: false, message: "No OTP found for this email" });
    }

    const now = new Date();

    if (now > otpEntry.expiresAt) {
      await deleteOtp(email);
      return res.status(410).json({ success: false, message: "OTP has expired" });
    }

    if (userOtp !== otpEntry.otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    await deleteOtp(email);

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "Server error during OTP verification" });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  sendOtp,
  verifyOtp,
};
