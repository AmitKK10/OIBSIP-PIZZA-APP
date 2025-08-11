// server/controllers/orderController.js


const Order = require('../models/orderModel'); // Make sure you have an Order model
const sendEmail = require('../utils/sendEmail'); // Optional: If you want email notifications
const Inventory = require('../models/Inventory');

exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentInfo, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }

    // ✅ Check stock availability
    for (const item of items) {
      const stock = await Inventory.findOne({ name: item.name });
      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
        });
      }
    }

    // ✅ Deduct stock
    for (const item of items) {
      await Inventory.updateOne(
        { name: item.name },
        { $inc: { quantity: -item.quantity } }
      );
    }

    // ✅ Create order
    const order = new Order({
      userId: req.user.userId, // Correct field
      items,
      totalAmount,
      paymentInfo,
      address,
      phone,
      status: 'Pending',
    });

    await order.save();

    // ✅ Low Stock Alert
    const lowStockItems = await Inventory.find({ quantity: { $lt: 20 } });
    if (lowStockItems.length > 0) {
      console.warn('Low stock alert:', lowStockItems.map(i => `${i.name}: ${i.quantity}`));
      // Optionally send email to admin here
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('❌ Order placement error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



// ✅ Get Orders for Logged-in User
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ Fetch orders error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Fetch all orders for admin

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') // Fetch user details (name/email)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error('❌ Error fetching all orders:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
