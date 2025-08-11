//seeders/seedInventory.js

require('dotenv').config();
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');

// Sample inventory items
const inventoryItems = [
  { name: 'Cheese', quantity: 100, unit: 'kg', type: 'cheese' },
  { name: 'Tomato Sauce', quantity: 50, unit: 'liters', type: 'sauce' },
  { name: 'Pepperoni', quantity: 80, unit: 'kg', type: 'meat' },
  { name: 'Flour', quantity: 200, unit: 'kg', type: 'base' },
  { name: 'Mushroom', quantity: 60, unit: 'kg', type: 'veggie' },
];

async function seedInventory() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-app';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected');

    await Inventory.deleteMany(); // Optional: clear old data
    const inserted = await Inventory.insertMany(inventoryItems);
    console.log(`📦 Seeded ${inserted.length} inventory items`);

  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

seedInventory();
