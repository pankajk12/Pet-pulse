const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

// Dashboard route - ensures user is authenticated and loads user data
router.get('/', async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    
    // Always fetch fresh user data from database to prevent stale session data issues
    const userData = await User.findById(req.session.user._id).lean();
    if (!userData) {
      // If user no longer exists in database, destroy session and redirect
      req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
        // Continue with redirect regardless of session destroy success
      });
      return res.redirect('/auth/login');
    }
    
    // Get user's orders sorted by date (newest first)
    const orders = await Order.find({ user: userData._id })
                         .sort({ date: -1 })
                         .lean() || [];
    
    // Get cart items and calculate total from the fresh user data
    const cartItems = userData.cart || [];
    const total = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0).toFixed(2);
    
    // Render dashboard with all necessary data
    res.render('dashboard', {
      title: 'PetSewa Dashboard',
      user: userData,  // Use the fresh user data from database
      cartItems,
      total,
      orders,
      hasOrders: orders.length > 0
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    next(err); // Forward to error handler middleware
  }
});

module.exports = router;
