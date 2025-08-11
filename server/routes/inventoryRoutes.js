
//routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} = require('../controllers/InventoryController');

// 📦 GET all inventory
router.get('/', getInventory);

// ➕ POST new inventory
router.post('/', addInventory);

// ✏️ PUT update by ID
router.put('/:id', updateInventory);

// ❌ DELETE by ID
router.delete('/:id', deleteInventory);

module.exports = router;
