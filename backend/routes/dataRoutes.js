const express = require('express');
const { scanData } = require('../controllers/dataController');
const router = express.Router();

// Data fetching route
router.get('/scan', scanData);

module.exports = router;