let gfs;
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const mongoose = require('mongoose');

// Initialize GridFS
const initGridFS = (conn) => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
};

// Create storage engine for multer-gridfs-storage
const storage = new GridFsStorage({
    url: 'mongodb+srv://Kevin:lKFhYwjZd7gjLU6X@digital-file-cabinet.hqp5c.mongodb.net/Digital-File-Cabinet',
    file: (req, file) => ({
        filename: file.originalname,
        bucketName: 'uploads',
    }),
});
const upload = multer({ storage });

const uploadFile = (req, res) => {
    res.json({ file: req.file });
};

const getFile = (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
};

module.exports = { initGridFS, uploadFile, getFile, upload };