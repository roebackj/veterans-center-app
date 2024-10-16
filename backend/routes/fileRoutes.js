const express = require('express');
const { uploadFile, getFile, upload } = require('../controllers/fileController');
const router = express.Router();

// File upload route
router.post('/upload', upload.single('file'), uploadFile);

// File retrieval route
router.get('/:filename', getFile);

module.exports = router;