// src/pages/Login.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const [identifier, setIdentifier] = useState(localStorage.getItem("identifier") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast.warning("Please fill all fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(identifier) && !/^\d{10}$/.test(identifier)) {
      toast.warning("Enter a valid email or 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:55000/api/auth/login", {
        identifier,
        password,
      });

      // Save auth token and user details in localStorage, including phone and active status
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "User");
      localStorage.setItem("email", res.data.email || "");
      localStorage.setItem("userId", res.data.userId || "");
      localStorage.setItem("phone", res.data.phone || "");
      localStorage.setItem("active", res.data.isVerified ? "true" : "false");

      if (rememberMe) {
        localStorage.setItem("identifier", identifier);
      } else {
        localStorage.removeItem("identifier");
      }

      toast.success("Login successful");
      navigate(res.data.role === "admin" ? "/admin-inventory" : "/home");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="pizza-animation"></div>
        <h2 className="title">🍕 Welcome Back!</h2>
        <p className="subtitle">Login to continue your pizza journey</p>
        <input
          ref={inputRef}
          placeholder="Email or Mobile"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-field"
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            className="input-field"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="options-row">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember Me
          </label>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-btn"
        >
          {loading ? <div className="spinner"></div> : "Login"}
        </button>
        <p className="register-text">
          Don’t have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
