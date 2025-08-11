//src/services.authService.jsx

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Update as per backend

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const verifyOTP = (data) => axios.post(`${API_URL}/verify-otp`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
export const forgotPassword = (data) => axios.post(`${API_URL}/forgot-password`, data);
export const resetPassword = (data) => axios.post(`${API_URL}/reset-password`, data);
export const changePassword = (data, token) =>
  axios.post(`${API_URL}/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
