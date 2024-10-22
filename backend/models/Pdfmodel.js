const mongoose = require('mongoose');

const PdfSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
});

const PdfModel = mongoose.model('Pdf', PdfSchema);
module.exports = PdfModel;
