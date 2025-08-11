// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email: stateEmail, mobile: stateMobile, otp: stateOtp } = location.state || {};
  const [identifier, setIdentifier] = useState(stateEmail || stateMobile || "");
  const [otp, setOtp] = useState(stateOtp || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    // Password strength logic
    if (value.length < 6) setStrength("Weak");
    else if (/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) setStrength("Strong");
    else setStrength("Medium");
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!identifier || !otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
  {
        identifier,
        otp,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to reset password";
      toast.error(msg);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <div className="pizza-animation"></div>
        <h2 className="title">Reset Password 🍕</h2>
        <p className="subtitle">Set a strong password for better security</p>

        <form onSubmit={handleReset}>
          <input
            className="input-field"
            type="text"
            placeholder="Enter email or mobile"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />
          <div className={`strength ${strength.toLowerCase()}`}>Strength: {strength}</div>
          <input
            className="input-field"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="reset-btn">Update Password</button>
        </form>
        <p className="login-text">
          Remembered your password?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>Login</button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
