//controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// Register with auto-verification
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;

    // Validation
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Mobile already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: role || 'customer',
      isVerified: true,  // Auto-verify user
      otp: null,        // Skip OTP
      otpExpiry: null   // Skip expiry
    });

    await user.save();

    console.log(`✅ Registration successful for ${email} (OTP skipped)`);
    
    return res.status(201).json({ 
      message: 'Registration successful', 
      email: user.email,
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Login (unchanged)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

return res.json({
  token,
  userId: user._id,
  email: user.email,
  role: user.role,
  name: user.name,
  phone: user.mobile,          
  isVerified: user.isVerified   
});


  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// Keep other functions (for API consistency) but they won't be used
exports.verifyOTP = async (req, res) => {
  return res.status(200).json({ message: 'OTP verification is disabled in this mode' });
};

// Login

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // changed from 'email'
    
    // ✅ Try to find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ error: 'Account not verified' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      token,
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
};


// Forgot Password (Email or Mobile)
exports.forgotPassword = async (req, res) => {
  const { identifier } = req.body;

  try {
    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP(); // e.g., "196572"
    user.otp = otp;
    await user.save();

    console.log(`✅ Reset OTP for ${identifier}: ${otp}`);

    // 🟡 Return the OTP in the response (dev only)
    res.status(200).json({
      message: "OTP sent successfully",
      identifier,
      otp, // <== Only for dev preview
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// Reset Password (via email or mobile)
exports.resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Optional: check for expiration if using `user.otpExpiry`
    if (user.otpExpiry && Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Error resetting password" });
  }
};


// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password incorrect' });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error changing password' });
  }
};
