const User = require('../models/User');
let Order = null;

// Attempt to require Order model gracefully
try {
  Order = require('../models/Order');
} catch (e) {
  console.warn('Order model not found. Orders will not be available on dashboard.');
}

/**
 * GET /dashboard
 * Renders the user dashboard with profile, cart, and order history.
 */
exports.getDashboard = async (req, res) => {
  try {
    // Validate session and user
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).render('error', { message: "Unauthorized access." });
    }

    // Fetch user profile
    const user = await User.findById(req.session.user._id).lean();
    if (!user) {
      return res.status(404).render('error', { message: "User not found." });
    }
    
    // Fetch orders if Order model exists
    let orders = [];
    if (Order) {
      try {
        orders = await Order.find({ user: user._id }).sort({ date: -1 }).lean();
      } catch (orderErr) {
        console.error('Error fetching orders:', orderErr);
      }
    }

    // Calculate cart total
    const cartItems = Array.isArray(user.cart) ? user.cart : [];
    const total = cartItems.reduce(
      (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
      0
    );

    // Render dashboard
    res.render('dashboard', {
      user,              // has full name, used throughout the EJS
      cartItems,         // current items in cart
      total,             // cart total
      orders             // user's order history
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).render('error', { message: "Unable to load dashboard." });
  }
};
