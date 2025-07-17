const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

/*
  Cart Routes
  -----------
  These routes handle all cart-related functionality including:
  - Viewing the cart
  - Adding products to cart
  - Removing products from cart
  - Processing checkout
*/

// Helper: ensure user is logged in
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/auth/login');
}

// View cart (GET)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Get updated user cart from DB
    const user = await User.findById(req.session.user._id).lean();
    const cartItems = user.cart || [];
    res.render('cart', {
      title: 'Your Cart',
      cartItems: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
      user: user,
      cartCount: cartItems.length
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).send('Error loading cart');
  }
});

// Add product to cart (POST)
router.post('/add', isAuthenticated, async (req, res) => {
  // Expect req.body to have product info: productId, name, price, quantity, etc.
  const { productId, name, price, quantity } = req.body;
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check if already in cart
    const existing = user.cart.find(item => String(item.productId) === String(productId));
    if (existing) {
      existing.quantity += Number(quantity || 1);
    } else {
      user.cart.push({ 
        productId, 
        name, 
        price: Number(price), 
        quantity: Number(quantity || 1) 
      });
    }
    await user.save();
    
    // Return JSON for AJAX requests or redirect for form submissions
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ 
        success: true, 
        cartCount: user.cart.length,
        message: 'Item added to cart'
      });
    } else {
      res.redirect('/cart');
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).send('Error adding to cart');
  }
});

// Remove product from cart (POST)
router.post('/remove', isAuthenticated, async (req, res) => {
  // Expect req.body.productId
  const { productId } = req.body;
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.cart = user.cart.filter(item => String(item.productId) !== String(productId));
    await user.save();
    
    // Return JSON for AJAX requests or redirect for form submissions
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ 
        success: true, 
        cartCount: user.cart.length,
        message: 'Item removed from cart'
      });
    } else {
      res.redirect('/cart');
    }
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).send('Error removing from cart');
  }
});

// Checkout (POST) -> place an "order": move cart items to order
router.post('/checkout', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.cart || user.cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Make order from cart items
    const newOrder = new Order({
      user: user._id,
      items: user.cart,
      date: new Date(),
      status: 'pending'
    });
    await newOrder.save();

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Return JSON for AJAX requests or redirect for form submissions
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ 
        success: true, 
        orderId: newOrder._id,
        message: 'Order placed successfully'
      });
    } else {
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).send('Checkout failed');
  }
});

// Get cart count (for AJAX updates)
router.get('/count', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    return res.json({ 
      success: true, 
      cartCount: user.cart.length 
    });
  } catch (err) {
    console.error('Error fetching cart count:', err);
    res.status(500).json({ error: 'Error fetching cart count' });
  }
});

// Update item quantity in cart
router.post('/update-quantity', isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const item = user.cart.find(item => String(item.productId) === String(productId));
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });
    
    // Update quantity or remove if quantity is 0
    if (Number(quantity) <= 0) {
      user.cart = user.cart.filter(item => String(item.productId) !== String(productId));
    } else {
      item.quantity = Number(quantity);
    }
    
    await user.save();
    
    // Calculate new total
    const total = user.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    
    return res.json({ 
      success: true, 
      cartCount: user.cart.length,
      total: total,
      message: 'Cart updated'
    });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    res.status(500).json({ error: 'Error updating cart' });
  }
});

module.exports = router;
