const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const router = express.Router();

router.get('/admin', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.send('Welcome Admin!');
});

router.get('/user', authenticateToken, authorizeRoles(['user', 'admin']), (req, res) => {
  res.send('Welcome User!');
});

module.exports = router;
