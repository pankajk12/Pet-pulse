/**
 * Main routing file for the pet care application
 * Handles all primary page routes and form submissions
 */
const express = require('express');
const router = express.Router();

/**
 * Helper function to generate dummy orders for demo purposes
 * Will be replaced with actual database queries in production
 * @param {Object} user - The user object from session
 * @return {Object} Collection of different order types
 */
function getDummyOrdersFor(user) {
  if (!user) return { grooming: [], emergency: [], other: [] };
  return {
    grooming: [
      { date: '2024-06-29', service: 'Bathing', status: 'confirmed', details: 'Dog grooming at home' },
      { date: '2024-07-05', service: 'Full Grooming', status: 'pending', details: 'Cat grooming session' }
    ],
    emergency: [
      { date: '2024-06-24', condition: 'Injured', status: 'completed', location: 'Sector 21', details: 'Minor cut, required first aid' },
      { date: '2024-06-30', condition: 'Sick', status: 'in-progress', location: 'Sector 15', details: 'Pet showing symptoms of fever' }
    ],
    other: [
      { date: '2024-06-25', type: 'medicine', status: 'pending', details: 'Order for dog medicine' },
      { date: '2024-07-02', type: 'supplies', status: 'shipped', details: 'Pet food and accessories' }
    ]
  };
}

// Main page routes
router.get('/', (req, res) => {
  res.render('index', { title: 'Home Page', user: req.session.user || null });
});

// Product and service pages
router.get('/pet-medicines', (req, res) => {
  res.render('pet-medicines', { user: req.session.user || null });
});

router.get('/home-services', (req, res) => {
  res.render('home-services', { user: req.session.user || null });
});

// Information pages
router.get('/about-us', (req, res) => {
  res.render('about-us', { user: req.session.user || null });
});

router.get('/contact-us', (req, res) => {
  res.render('contact-us', { user: req.session.user || null });
});

// Contact form submission handler
router.post('/contact-us', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Contact Form:', { name, email, subject, message });
  // TODO: Add actual email sending or database storage
  res.redirect('/contact-us');
});

// Emergency service routes
router.get('/emergency', (req, res) => {
  res.render('emergency', { user: req.session.user || null });
});

// Emergency request handler
router.post('/emergency', (req, res) => {
  const { emergencyType, details } = req.body;
  console.log('Emergency Form:', { emergencyType, details });
  // TODO: Add notification system for emergency requests
  res.redirect('/emergency');
});


module.exports = router;
