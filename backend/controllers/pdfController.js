const multer = require('multer');
const PdfModel = require('../models/PdfModel');
const path = require('path');

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

        
        const filePath = req.file.path.replace(/\\/g, '/');

        const pdfDocument = new PdfModel({
            title: req.body.title,
            filePath: filePath, 
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