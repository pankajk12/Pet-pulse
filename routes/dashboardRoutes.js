// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard route
router.get('/dashboard', dashboardController.getDashboard);

module.exports = router;