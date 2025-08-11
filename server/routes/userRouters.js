const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Test route for GET /api/auth
router.get('/', (req, res) => {
  res.send('🔐 Auth endpoint is active');
});

// Real routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
