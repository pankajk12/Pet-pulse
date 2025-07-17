const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/petsewa', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'petsewa-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Simple helper for all views - makes user available in templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404, 'Page Not Found'));
});

// Error handler (pass error obj always)
app.use((err, req, res, next) => {
  res.locals.message = err.message || 'Something went wrong!';
  res.locals.error = req.app.get('env') === 'development' ? err : (err || {});
  res.status(err.status || 500);
  res.render('error', { message: res.locals.message, error: res.locals.error });
});

module.exports = app;
