// controllers/cartController.js
const User = require('../models/User');
const Order = require('../models/Order');

// Get user cart
exports.viewCart = async (req, res) => {
  const user = await User.findById(req.session.user._id).lean();
  res.render('cart', {
    user,
    cartItems: user.cart || [],
    total: (user.cart || []).reduce((sum, i) => sum + (i.price * i.quantity), 0)
  });
};

// Add to cart
exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity } = req.body;
  const user = await User.findById(req.session.user._id);

  // Find if already in cart
  const idx = user.cart.findIndex(i => i.productId === productId);
  if (idx > -1) {
    user.cart[idx].quantity += (quantity ? Number(quantity) : 1);
  } else {
    user.cart.push({ productId, name, price, quantity: quantity || 1 });
  }
  await user.save();
  res.json({ success: true, cart: user.cart });
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.session.user._id);
  user.cart = user.cart.filter(i => i.productId !== productId);
  await user.save();
  res.json({ success: true, cart: user.cart });
};

// Checkout & place cart as order
exports.checkoutCart = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  if (!user.cart.length) return res.redirect('/cart');
  const total = user.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  await new Order({
    user: user._id,
    items: user.cart,
    total,
    type: 'cart',
    status: 'pending'
  }).save();
  user.cart = [];
  await user.save();
  res.redirect('/dashboard');
};