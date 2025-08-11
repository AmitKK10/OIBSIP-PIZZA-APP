// seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');

const pizzas = [
  {
    name: 'Margherita',
    description: 'Classic delight with 100% real mozzarella cheese',
    category: 'Veg',
    prices: [
      { small: 199, medium: 299, large: 399 }
    ],
    image: 'https://www.dominos.co.in/files/items/Margherit.jpg'
  },
  {
    name: 'Farmhouse',
    description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom',
    category: 'Veg',
    prices: [
      { small: 249, medium: 349, large: 449 }
    ],
    image: 'https://www.dominos.co.in/files/items/Farmhouse.jpg'
  },
  {
    name: 'Pepperoni',
    description: 'Loaded with extra pepperoni and cheese',
    category: 'Non-Veg',
    prices: [
      { small: 299, medium: 399, large: 499 }
    ],
    image: 'https://www.dominos.co.in/files/items/Pepperoni.jpg'
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-app');
    console.log('✅ Connected to MongoDB');

    await Pizza.deleteMany(); // Optional: clear existing data
    await Pizza.insertMany(pizzas);
    console.log('🌱 Seeded pizza data successfully!');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

seedDB();
