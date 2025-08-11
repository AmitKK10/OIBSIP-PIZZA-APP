const mongoose = require('mongoose');

const predefinedPizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: {
    base: String,
    sauce: String,
    cheese: String,
    veggies: [String],
    meat: [String]
  },
  sizes: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  image: { type: String }
});

module.exports = mongoose.model('PredefinedPizza', predefinedPizzaSchema);
