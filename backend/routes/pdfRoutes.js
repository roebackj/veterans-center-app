const PdfModel = require('../models/PdfModel');

const express = require('express');
const { uploadPdf, getPdfs, upload } = require('../controllers/pdfController');
const router = express.Router();

// Route to upload a PDF
router.post('/upload', upload.single('pdf'), uploadPdf);

// Route to get PDFs
router.get('/', getPdfs);

router.delete('/:id', async (req, res) => {
    try {
        const pdfId = req.params.id;
        const deletedPdf = await PdfModel.findByIdAndDelete(pdfId);

        if (!deletedPdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }

        res.json({ message: 'PDF deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting PDF', error: error.message });
    }
});



module.exports = router;
