const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /auth/signup
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const isAjax = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1);

  if (!name || !email || !password || !confirmPassword) {
    if (isAjax) return res.status(400).json({ message: 'All fields required!' });
    return res.status(400).render('signup', { error: 'All fields required!' });
  }

  if (password !== confirmPassword) {
    if (isAjax) return res.status(400).json({ message: 'Passwords do not match!' });
    return res.status(400).render('signup', { error: 'Passwords do not match!' });
  }

  // Duplicate check
  const already = await User.findOne({ email });
  if (already) {
    if (isAjax) return res.status(400).json({ message: 'User exists!' });
    return res.status(400).render('signup', { error: 'User exists!' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hash,
    cart: []
  });

  req.session.user = { _id: user._id, name: user.name, email: user.email };
  if (isAjax) return res.status(200).json({ redirect: '/dashboard' });
  res.redirect('/dashboard');
});

module.exports = router;
