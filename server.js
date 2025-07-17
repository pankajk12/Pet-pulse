const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const dashboardRoutes = require('./routes/dashboard');
const indexRoutes = require('./routes/index');

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petsewa';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo Connected'))
  .catch(e => console.error(e));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'petsewaSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Middleware: Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Use routers
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/', indexRoutes);

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page Not Found', 
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error: { status: 500 }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
