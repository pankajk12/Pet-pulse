// 1. routes/petMedicines.js
const express = require('express');
const router = express.Router();

// GET Pet Medicines page
router.get('/', (req, res) => {
  res.render('pet-medicines', { user: req.session.user });
});

// POST Pet Medicine Order (simplified!)
router.post('/', (req, res) => {
  const { medicine, quantity } = req.body;
  // In real app, store in orders db
  console.log('Order medicine:', { user: req.session.user, medicine, quantity });
  res.redirect('/pet-medicines');
});

module.exports = router;


// 2. routes/homeServices.js
const express = require('express');
const router = express.Router();

// GET Home Services
router.get('/', (req, res) => {
  res.render('home-services', { user: req.session.user });
});

// POST Book Home Service
router.post('/', (req, res) => {
  const { serviceType, date, time } = req.body;
  console.log('Book home service:', { user: req.session.user, serviceType, date, time });
  res.redirect('/home-services');
});

module.exports = router;


// 3. routes/emergency.js
const express = require('express');
const router = express.Router();

// GET Emergency page
router.get('/', (req, res) => {
  res.render('emergency', { user: req.session.user });
});

// POST Emergency form
router.post('/', (req, res) => {
  const { emergencyType, details } = req.body;
  console.log('Emergency submit:', { user: req.session.user, emergencyType, details });
  res.redirect('/emergency');
});

module.exports = router;


// 4. routes/aboutUs.js
const express = require('express');
const router = express.Router();

// GET About Us page
router.get('/', (req, res) => {
  res.render('about-us', { user: req.session.user });
});

// POST About Us contact (optional, usually this is just GET)
router.post('/', (req, res) => {
  // Not typical, but logs the attempt
  console.log('About us POST:', req.body);
  res.redirect('/about-us');
});

module.exports = router;


// 5. routes/contactUs.js
const express = require('express');
const router = express.Router();

// GET Contact Us page
router.get('/', (req, res) => {
  res.render('contact-us', { user: req.session.user });
});

// POST Contact Us form
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Contact form:', { user: req.session.user, name, email, subject, message });
  res.redirect('/contact-us');
});

module.exports = router;


// --- Update to dashboard route: Fetch username from DB ---

// In routes/index.js (replace/patch the dashboard route like this):
const User = require('../models/User'); // Add this at the top after other requires

router.get('/dashboard', async (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) {
    return res.redirect('/auth/login');
  }

  // Fetch user details from DB using their email (assuming unique)
  const userDoc = await User.findOne({ email: sessionUser.email });
  const fullUser = userDoc ? {
    name: userDoc.name,
    email: userDoc.email,
    cart: userDoc.cart || [],
    // Add any other fields you wish to show
  } : sessionUser;

  // Your order fetching logic (use dummy/sample orders or real ones)
  const orders = getDummyOrdersFor(fullUser);

  res.render('dashboard', {
    title: 'User Dashboard',
    user: fullUser, // user from DB, not just session
    groomingBookings: orders.grooming,
    emergencyBookings: orders.emergency,
    otherOrders: orders.other
  });
});
// -- End dashboard patch/update --