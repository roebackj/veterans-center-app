const PdfModel = require('../models/PdfModel');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create a set to keep track of processed file hashes
const processedHashes = new Set();

async function processPdfFile(filePath) {
    // Calculate the file hash using SHA-256
    const fileBuffer = fs.readFileSync(filePath);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check if the file hash is already processed
    if (processedHashes.has(fileHash)) {
        console.log('PDF already processed, skipping...');
        return;
    }

    // Check if a PDF with the same hash already exists in the database
    const existingPdf = await PdfModel.findOne({ fileHash });
    if (existingPdf) {
        console.log('PDF already exists in the database, skipping...');
        return;
    }

    // Add the hash to the processed set
    processedHashes.add(fileHash);

    // Create and save the new PDF document in the database
    const pdfDocument = new PdfModel({
        title: path.basename(filePath, path.extname(filePath)), // Use file name as title
        filePath: filePath.replace(/\\/g, '/'), // Normalize the file path
        fileHash: fileHash, // Save the file hash for reference
    });

    await pdfDocument.save();
    console.log(`PDF saved to database: ${pdfDocument.title}`);
}

module.exports = { processPdfFile };
