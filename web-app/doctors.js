const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Simple doctor route for now
router.get('/dashboard', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Doctor dashboard endpoint'
  });
});

module.exports = router;