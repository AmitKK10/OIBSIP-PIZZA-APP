// src/pages/VerifyOTP.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { identifier, otp: serverOtp } = location.state || {};

  const handleVerify = (e) => {
    e.preventDefault();
    if (!identifier) {
      return toast.error("Email/Mobile not found. Please restart.");
    }
    if (!otp) {
      return toast.error("Please enter the OTP");
    }

    // ✅ For development: client-side validation
    if (otp !== serverOtp) {
      toast.error("Invalid OTP (for dev check only)");
    } else {
      toast.success("OTP verified successfully");
      navigate("/reset-password", { state: { identifier, otp } });
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <div className="pizza-animation"></div>
        <h2 className="title">Verify OTP 🍕</h2>
        <p className="subtitle">Enter the OTP sent to your email or mobile</p>
        {serverOtp && (
          <p className="dev-otp">
            <strong>Dev OTP:</strong> {serverOtp}
          </p>
        )}
        <form onSubmit={handleVerify}>
          <input
            className="input-field"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" className="verify-btn">
            Verify OTP
          </button>
        </form>
        <p className="login-text">
          Didn’t receive the OTP?{" "}
          <button className="link-button" onClick={() => navigate("/forgot-password")}>
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
