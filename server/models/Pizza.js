const mongoose = require('mongoose'); // Only once!

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String }],
  sizes: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String }
});

module.exports = mongoose.model('Pizza', pizzaSchema);
