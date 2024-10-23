const multer = require('multer');
const PdfModel = require('../models/PdfModel');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage: storage });

const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Generate the file path
        const filePath = req.file.path.replace(/\\/g, '/');

        // Calculate file hash using SHA-256
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Create and save the new PDF document
        const pdfDocument = new PdfModel({
            title: req.body.title,
            filePath: filePath,
            fileHash: fileHash, // Save the file hash for reference
        });

        await pdfDocument.save();
        res.json({ message: 'PDF uploaded and saved', id: pdfDocument._id });
    } catch (error) {
        console.error("Error saving PDF data:", error);
        res.status(500).json({ message: 'Error saving PDF data', error: error.message });
    }
};

const getPdfs = async (req, res) => {
    try {
        const pdfs = await PdfModel.find();
        res.json(pdfs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving PDFs' });
    }
};

module.exports = { uploadPdf, getPdfs, upload };
