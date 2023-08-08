const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureNotAuthenticated } = require('../utils/authMiddleware');

// Protected route for authenticated users
router.get('/profile', ensureAuthenticated, (req, res, next) => {
  // Render the profile page
});

// Route accessible only for not authenticated users
router.get('/login', ensureNotAuthenticated, (req, res, next) => {
  // Render the login page
});

module.exports = router;
