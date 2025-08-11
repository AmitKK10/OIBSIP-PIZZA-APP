require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedUsers() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-app';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'customer'
      }
    ];

    await User.deleteMany(); // Optional: clear existing users
    const insertedUsers = await User.insertMany(users);

    console.log('👤 Users seeded successfully!');
    insertedUsers.forEach(user => {
      console.log(`🔑 ${user.role.toUpperCase()} - ${user.email} - ID: ${user._id}`);
    });

  } catch (err) {
    console.error('❌ User seeding error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

seedUsers();
