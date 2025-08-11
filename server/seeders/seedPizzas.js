const Pizza = require('../models/Pizza');
const Order = require('../models/Order');
const PredefinedPizza = require('../models/PredefinedPizza');

// GET /api/pizza
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
};

// POST /api/pizza/add
const addPizza = async (req, res) => {
  try {
    const { name, ingredients, price, size } = req.body;

    const newPizza = new Pizza({ name, ingredients, price, size });
    await newPizza.save();

    res.status(201).json({ message: 'Pizza added successfully', pizza: newPizza });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add pizza' });
  }
};

// POST /api/pizza/order
const placeOrder = async (req, res) => {
  try {
    const { pizzas, totalPrice } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!pizzas || pizzas.length === 0) {
      return res.status(400).json({ error: 'No pizzas in the order.' });
    }

    const newOrder = new Order({
      pizzas,
      totalPrice,
      user: userId
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /api/pizza/predefined
const getPredefinedPizzas = async (req, res) => {
  try {
    const predefinedPizzas = [
      {
        name: 'Margherita',
        ingredients: ['Tomato Base', 'Mozzarella Cheese'],
        price: 199,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://static.toiimg.com/thumb/53110049.cms?width=1200&height=900'
      },
      {
        name: 'Pepperoni',
        ingredients: ['Tomato Base', 'Mozzarella Cheese', 'Pepperoni'],
        price: 299,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://images.dominos.co.in/new_pepper_blast.jpg'
      },
      {
        name: 'Veggie Delight',
        ingredients: ['Tomato Base', 'Mozzarella', 'Onions', 'Capsicum', 'Corn'],
        price: 249,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://www.crazymasalafood.com/wp-content/images/veggie-delight.jpg'
      },
      {
        name: 'Farmhouse',
        ingredients: ['Tomato Base', 'Cheese', 'Onions', 'Tomatoes', 'Mushrooms'],
        price: 279,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://images.dominos.co.in/farmhouse.png'
      },
      {
        name: 'Paneer Makhani',
        ingredients: ['Makhani Sauce', 'Paneer', 'Capsicum', 'Red Paprika'],
        price: 299,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://images.dominos.co.in/paneer_makhni.png'
      },
      {
        name: 'Chicken Tikka',
        ingredients: ['Tomato Base', 'Mozzarella', 'Chicken Tikka', 'Onions'],
        price: 319,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://skydecklounge.in/wp-content/uploads/2022/01/Chicken-Tikka-Pizza.jpg'
      },
      {
        name: 'Mexican Green Wave',
        ingredients: ['Tomato Base', 'Mozzarella', 'Jalapeno', 'Capsicum', 'Onions', 'Mexican Herbs'],
        price: 269,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://images.dominos.co.in/mexican_green_wave.png'
      },
      {
        name: 'Cheese N Corn',
        ingredients: ['Tomato Base', 'Cheese', 'Sweet Corn'],
        price: 229,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://images.dominos.co.in/cheese_n_corn.png'
      },
      {
        name: 'BBQ Chicken',
        ingredients: ['BBQ Sauce', 'Grilled Chicken', 'Onions', 'Mozzarella'],
        price: 329,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://img.freepik.com/premium-photo/bbq-chicken-pizza-with-mozzarella-red-onion-cilantro_908985-2760.jpg'
      },
      {
        name: 'Tandoori Paneer',
        ingredients: ['Tandoori Sauce', 'Paneer', 'Bell Peppers', 'Onions'],
        price: 289,
        size: ['Small', 'Medium', 'Large'],
        image: 'https://images.dominos.co.in/new_tandoori_paneer.jpg'
      }
    ];
    res.status(200).json(predefinedPizzas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load predefined pizzas' });
  }
};

module.exports = {
  getPizzas,
  addPizza,
  placeOrder,
  getPredefinedPizzas
};
