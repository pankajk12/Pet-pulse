/**
 * FILE: /models/User.js
 * MongoDB/Mongoose User schema for registration, login, session info
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    next();
  } catch (err) { next(err); }
});

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);


/**
 * FILE: /models/Order.js
 * Handles grooming, emergency, and other booking/order types.
 */
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['grooming', 'emergency', 'medicine', 'other'], required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in-progress', 'shipped'], default: 'pending' },
  details: mongoose.Schema.Types.Mixed // Flexible: for grooming, condition, medicine, etc
});
module.exports = mongoose.model('Order', OrderSchema);


/**
 * FILE: /controllers/authController.js
 */
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.render('signup', { error: "All fields required." });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.render('signup', { error: "Email exists." });
    const user = await new User({ name, email, password }).save();
    req.session.user = { _id: user._id, name: user.name, email: user.email };
    res.redirect('/dashboard');
  } catch (err) {
    res.render('signup', { error: "Signup failed!" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.render('login', { error: "All fields required." });
  const user = await User.findOne({ email });
  if (!user) return res.render('login', { error: "User not found!" });
  const pwd = await user.verifyPassword(password);
  if (!pwd) return res.render('login', { error: "Invalid password!" });
  req.session.user = { _id: user._id, name: user.name, email: user.email };
  res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};


/**
 * FILE: /controllers/orderController.js
 */
const Order = require('../models/Order');
exports.createOrder = async (req, res) => {
  const { type, details } = req.body;
  const userId = req.session.user._id;
  const order = await new Order({ user: userId, type, details }).save();
  res.redirect('/dashboard'); // or res.json({ success: true, order })
};
exports.getUserOrders = async (req, res) => {
  const userId = req.session.user._id;
  const all = await Order.find({ user: userId }).sort({ date: -1 }).lean();
  // Split into categories for the dashboard
  const grooming = all.filter(o => o.type === 'grooming');
  const emergency = all.filter(o => o.type === 'emergency');
  const other = all.filter(o => o.type !== 'grooming' && o.type !== 'emergency');
  res.render('dashboard', {
    user: req.session.user,
    groomingBookings: grooming,
    emergencyBookings: emergency,
    otherOrders: other
  });
};


/**
 * FILE: /routes/auth.js
 */
const express = require('express');
const router = express.Router();
const authC = require('../controllers/authController');

router.get('/login', (req, res) => res.render('login'));
router.post('/login', authC.login);
router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', authC.signup);
router.get('/logout', authC.logout);

module.exports = router;


/**
 * FILE: /routes/orders.js
 */
const express = require('express');
const router = express.Router();
const orderC = require('../controllers/orderController');

// All following routes protected: require login
function requireLogin(req, res, next) {
  if (!req.session.user?._id) return res.redirect('/auth/login');
  next();
}

router.post('/create', requireLogin, orderC.createOrder);

module.exports = router;


/**
 * FILE: /routes/index.js
 */
const express = require('express');
const router = express.Router();
const orderC = require('../controllers/orderController');

function requireLogin(req, res, next) {
  if (!req.session.user?._id) return res.redirect('/auth/login');
  next();
}

router.get('/', (req, res) => res.render('index', { user: req.session.user || null }));
router.get('/dashboard', requireLogin, orderC.getUserOrders);

router.get('/pet-medicines', (req, res) => res.render('pet-medicines', { user: req.session.user || null }));
router.get('/home-services', (req, res) => res.render('home-services', { user: req.session.user || null }));
router.get('/about-us', (req, res) => res.render('about-us', { user: req.session.user || null }));
router.get('/contact-us', (req, res) => res.render('contact-us', { user: req.session.user || null }));
router.get('/emergency', (req, res) => res.render('emergency', { user: req.session.user || null }));

module.exports = router;


/**
 * FILE: /app.js
 * Main Express App Loader
 */
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/petsewa', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(e => console.error('MongoDB connection error:', e));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'petsewa-secret-session',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Pass user to all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Mount routers
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/orders'));

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', { error: err });
});

module.exports = app;

/**
 * DATABASE SETUP:
 * 1. Install MongoDB and have it running on your local machine or MongoDB Atlas
 * 2. Install node deps: npm install mongoose express bcryptjs express-session cookie-parser morgan
 * 3. Place these files in the exact structure with app.js as your main app.
 * 4. Enjoy full login/signup with db, dashboard data from orders, booking forms saving new orders, and proper session logic.
 *
 * For more advanced user flows or features, integrate more as needed!
 */