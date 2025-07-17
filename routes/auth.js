const express = require('express');
const router = express.Router();
// We'll assume User model is implemented elsewhere
const User = require('../models/User');

// GET login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login Page' });
});

// POST login - robust implementation with error handling
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // User not found: render login page with error
      return res.render('login', { 
        title: 'Login Page', 
        error: 'Email not found. Please check your credentials or sign up.',
        email
      });
    }

    // Verify password using the method from User model
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      // Invalid password: render login page with error
      return res.render('login', { 
        title: 'Login Page', 
        error: 'Invalid password. Please try again.',
        email
      });
    }

    // Store user data in session (only essential info)
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      // Add any other non-sensitive fields needed for the app
    };
    
    // Set session expiry (optional, 24 hours)
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    
    // Ensure session is saved before redirecting
    req.session.save(() => {
      // Redirect to dashboard after successful login
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).render('login', { 
      title: 'Login Page', 
      error: 'An error occurred during login. Please try again.',
      email: req.body.email
    });
  }
});

// GET signup page
router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Signup Page' });
});

// POST signup - create new user with proper error handling
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`New signup attempt: ${name}, ${email}`);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', {
        title: 'Signup Page',
        error: 'Email already registered. Please use a different email or login.',
        name,
        email
      });
    }
    
    // Create new user (password hashing should be handled in the User model)
    const user = new User({ name, email, password });
    await user.save();
    
    // Store user in session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email
    };
    
    // Redirect to dashboard after successful registration
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).render('signup', {
      title: 'Signup Page',
      error: 'An error occurred during signup. Please try again.',
      name: req.body.name,
      email: req.body.email
    });
  }
});

// GET logout - with error handling
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      // Even if there's an error, redirect to home
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/');
  });
});

// Middleware to check if user is authenticated
// Exported separately for easier import in other routes
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  // Store the original URL they were trying to access
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
}

// Export the router and the middleware separately
// Usage in other files: const { isAuthenticated } = require('./routes/auth');
module.exports = router;
module.exports.isAuthenticated = isAuthenticated;
// This router should be mounted at '/auth' in app.js
