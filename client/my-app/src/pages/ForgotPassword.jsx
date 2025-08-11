// src/pages/ForgotPassword.jsx

/*
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState(""); // Can be email or phone
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:55000/api/auth/forgot-password", {
        identifier,
      });

      toast.success("OTP sent to your registered contact");

      // Pass identifier + otp to next screen (optional for dev preview)
      navigate("/verify-otp", {
        state: { identifier, otp: res.data.otp },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgot}>
        <input
          type="text"
          placeholder="Enter your email or mobile number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
*/

// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!identifier) {
      toast.warning("Please enter your email or mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:55000/api/auth/forgot-password",
        { identifier }
      );

      toast.success("OTP sent to your registered contact");
      navigate("/verify-otp", {
        state: { identifier, otp: res.data.otp },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <div className="pizza-animation"></div>
        <h2 className="title">Forgot Password 🍕</h2>
        <p className="subtitle">
          Enter your registered email or mobile to receive an OTP
        </p>
        <form onSubmit={handleForgot}>
          <input
            className="input-field"
            type="text"
            placeholder="Email or Mobile"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <button
            type="submit"
            className="forgot-btn"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "Send OTP"}
          </button>
        </form>
        <p className="login-text">
          Remember your password?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
