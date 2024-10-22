const express = require('express');
const { uploadPdf, getPdfs, upload } = require('../controllers/pdfController');
const router = express.Router();

// Route to upload a PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Route to get PDFs
router.get('/', getPdfs);

module.exports = router;
