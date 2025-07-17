/**
 * FILE: /models/Order.js
 * Separate file for orders (required by app and controller)
 */
const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  type: { type: String, enum: ['grooming', 'emergency', 'medicine', 'other', 'cart'] },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in-progress', 'shipped'], default: 'pending' },
  details: mongoose.Schema.Types.Mixed
});
module.exports = mongoose.model('Order', OrderSchema);


/**
 * FILE: /routes/cart.js
 */
const express = require('express');
const router = express.Router();
const cartC = require('../controllers/cartController');

function requireLogin(req, res, next) {
  if (!req.session.user || !req.session.user._id) return res.redirect('/auth/login');
  next();
}

router.get('/', requireLogin, cartC.viewCart);
router.post('/add', requireLogin, cartC.addToCart);
router.post('/remove', requireLogin, cartC.removeFromCart);
router.post('/checkout', requireLogin, cartC.checkoutCart);

module.exports = router;


/**
 * INTEGRATION: app.js (partial snippet to add or merge)
 */
const cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);

/* 
Place this after all other "require" blocks and before error handling in app.js.
This will make /cart, /cart/add, /cart/remove, /cart/checkout work.
*/

/**
 * You are now integrated:
 * - Users will have a cart.
 * - /cart shows their cart.
 * - /cart/add (POST) can be called from product/service/medicine add-to-cart buttons.
 * - /cart/checkout turns the cart into an order, appears on dashboard.
 *
 * Be sure User and Order schemas are individual files in /models.
 */