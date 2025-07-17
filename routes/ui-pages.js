const express = require('express');
const router = express.Router();

// Middleware for user (optional)
function setUser(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
}

router.use(setUser);

router.get('/', (req, res) => res.render('index', { user: req.session.user }));
router.get('/pet-medicines', (req, res) => res.render('pet-medicines', { user: req.session.user }));
router.get('/home-services', (req, res) => res.render('home-services', { user: req.session.user }));
router.get('/contact-us', (req, res) => res.render('contact-us', { user: req.session.user }));
router.get('/about-us', (req, res) => res.render('about-us', { user: req.session.user }));
router.get('/dashboard', (req, res) => res.render('dashboard', { user: req.session.user }));
router.get('/cart', (req, res) => res.render('cart', { user: req.session.user }));

module.exports = router;