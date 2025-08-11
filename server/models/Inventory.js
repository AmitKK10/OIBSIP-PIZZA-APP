//models/Inventory.js

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  type: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'veggies', 'meat'], // 👈 categorizing types
    required: true
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);
