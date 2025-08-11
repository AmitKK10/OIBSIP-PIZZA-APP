const express = require('express');
const router = express.Router();
const {
  addPizza,
  getPizzas,
  placeOrder,
  getPredefinedPizzas // ✅ Correctly included
} = require('../controllers/pizzaController');

const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPizzas);
router.get('/predefined', getPredefinedPizzas); // ✅ Correct route

// Protected routes
router.post('/add', authMiddleware, addPizza);
router.post('/order', authMiddleware, placeOrder);

module.exports = router;
