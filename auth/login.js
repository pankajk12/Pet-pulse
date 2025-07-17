const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /auth/login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).render('login', { error: 'All fields are required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).render('login', { error: 'User not found!' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).render('login', { error: 'Invalid credentials!' });

  req.session.user = { _id: user._id, name: user.name, email: user.email };
  res.redirect('/dashboard');
});

module.exports = router;