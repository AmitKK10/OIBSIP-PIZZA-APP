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
    const { name, ingredients, price } = req.body;

    const newPizza = new Pizza({ name, ingredients, price });
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
        image: 'https://www.dominos.co.in//files/items/Margherit.jpg',
        isVeg: true,
         category: 'Veg'
        
      },
      {
        name: 'Pepperoni',
        ingredients: ['Tomato Base', 'Mozzarella Cheese', 'Pepperoni'],
        price: 299,
        image: 'https://www.dominos.co.in//files/items/MicrosoftTeams-image_(20).png',
        isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Veggie Delight',
        ingredients: ['Tomato Base', 'Mozzarella', 'Onions', 'Capsicum', 'Corn'],
        price: 249,
        image: 'https://www.dominos.co.in/files/items/Digital_Veggie_Paradise_olo_266x265.jpg',
        isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Farmhouse',
        ingredients: ['Tomato Base', 'Cheese', 'Onions', 'Tomatoes', 'Mushrooms'],
        price: 279,
        image: 'https://www.dominos.co.in/files/items/Farmhouse.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Paneer Makhani',
        ingredients: ['Makhani Sauce', 'Paneer', 'Capsicum', 'Red Paprika'],
        price: 299,
        image: 'https://www.dominos.co.in//files/items/Paneer_Makhni.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Chicken Tikka',
        ingredients: ['Tomato Base', 'Mozzarella', 'Chicken Tikka', 'Onions'],
        price: 319,
        image: 'https://www.dominos.co.in/files/items/MicrosoftTeams-image_(18).png',
         isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Mexican Green Wave',
        ingredients: ['Tomato Base', 'Mozzarella', 'Jalapeno', 'Capsicum', 'Onions', 'Mexican Herbs'],
        price: 269,
        image: 'https://www.dominos.co.in/files/items/Mexican_Green_Wave.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'BBQ Chicken',
        ingredients: ['BBQ Sauce', 'Grilled Chicken', 'Onions', 'Mozzarella'],
        price: 329,
        image: 'https://www.dominos.co.in/files/items/Pepper_Barbeque_&_Onion.jpg',
         isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Tandoori Paneer',
        ingredients: ['Tandoori Sauce', 'Paneer', 'Bell Peppers', 'Onions'],
        price: 289,
        image: 'https://www.dominos.co.in//files/items/IndianTandooriPaneer.jpg',
         isVeg: true,
        category: 'Veg'
      },

      // 5 more veg pizzas
      {
        name: 'Fresh Veggie',
        ingredients: ['Onion', 'Capsicum'],
        price: 169,
        image: 'https://www.dominos.co.in/files/items/Fresh_Veggie.jpg',
         isVeg: true,
        category: 'Veg'
      },


      {
        name: 'Panner Makhani',
        ingredients: ['Paneer', 'Capsicum','Makhani Sauce'],
        price: 189,
        image: 'https://www.dominos.co.in/files/items/Paneer_Makhni.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Peppy Paneer',
        ingredients: ['Paneer', 'Capsicum', 'Red Pepper'],
        price: 229,
        image: 'https://www.dominos.co.in/files/items/Peppy_Paneer.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Veg Extravaganza',
        ingredients: ['Corn', 'Olives', 'Onions', 'Capsicum', 'Mushrooms', 'Tomatoes', 'Jalapeno'],
        price: 249,
        image: 'https://www.dominos.co.in/files/items/Veg_Extravaganza.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Deluxe Veggie',
        ingredients: ['Onions', 'Capsicum', 'Mushrooms', 'Paneer', 'Golden Corn'],
        price: 249,
        image: 'https://www.dominos.co.in/files/items/Deluxe_Veggie.jpg',
         isVeg: true,
        category: 'Veg'
      },
      {
        name: 'Cheese n Corn',
        ingredients: ['Cheese', 'Golden Corn'],
        price: 169,
        image: 'https://www.dominos.co.in/files/items/Corn_&_Cheese.jpg',
         isVeg: true,
        category: 'Veg'
      },

      // 5 more non-veg pizzas
      {
        name: 'Chicken Dominator',
        ingredients: ['Chicken Meatballs', 'Chicken Sausage', 'Pepper Barbecue Chicken', 'Chicken Tikka', 'Grilled Chicken Rashers'],
        price: 319,
        image: 'https://www.dominos.co.in/files/items/MicrosoftTeams-image_(11).png',
         isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Non‑Veg Supreme',
        ingredients: ['Pepper Barbecue Chicken', 'Onions', 'Mushrooms', 'Grilled Chicken', 'Chicken Sausage'],
        price: 319,
        image: 'https://www.dominos.co.in/files/items/MicrosoftTeams-image_(13).png',
         isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Chicken Fiesta',
        ingredients: ['Grilled Chicken', 'Capsicum', 'Onions'],
        price: 249,
        image: 'https://www.dominos.co.in/files/items/Chicken_Fiesta.jpg',
         isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Indi Chicken Tikka',
        ingredients: ['Chicken Tikka', 'Onions', 'Capsicum'],
        price: 319,
        image: 'https://www.dominos.co.in/files/items/MicrosoftTeams-image_(18).png',
         isVeg: false,
        category: 'Non-Veg'
      },
      {
        name: 'Chicken Golden Delight',
        ingredients: ['Pepperoni', 'Cheese'],
        price: 319,
        image: 'https://www.dominos.co.in/files/items/MicrosoftTeams-image_(14).png',
         isVeg: false,
        category: 'Non-Veg'
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
