//models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: { type: String, unique: true, required: true },
  role: { type: String, default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model('User', userSchema);
