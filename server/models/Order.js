/*

// server/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  pizzas: [
    {
      name: String,
      size: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalPrice: Number,
  paymentId: String,
  paymentStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ FIX: Check if model is already compiled
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
*/