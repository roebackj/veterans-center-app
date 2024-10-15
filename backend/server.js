const express = require('express'); // in Terminal, input this it to work: npm install express mongoose gridfs-stream multer multer-gridfs-storage cors"
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// MongoDB connection string
const mongoURI = 'mongodb+srv://Kevin:lKFhYwjZd7gjLU6X@digital-file-cabinet.hqp5c.mongodb.net/Digital-File-Cabinet';

// Enable CORS for React
app.use(cors());

// Serve static files from the "Vet.Center.Program" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Initialize GridFS
let gfs;
const conn = mongoose.createConnection(mongoURI);
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine for multer-gridfs-storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads'
        };
    }
});
const upload = multer({ storage });

// Upload and file fetching routes
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

app.get('/file/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
});

// /scan route to fetch data from MongoDB
const DummyRFC = new mongoose.Schema({
    "Last Name, First Name (Legal Name)": String
});
const DummyRFCModel = mongoose.model('DummyRFC', DummyRFC, 'RFC Dummy');

app.get('/scan', async (req, res) => {
    try {
        const data = await DummyRFCModel.find({}, { 
            _id: 0, 
            "Last Name, First Name (Legal Name)": 1, 
            "Student ID # (This is NOT your Social Security Number or SSO ID)": 1, 
            "Benefit you plan to utilize this term (check all that apply):": 1 
        });
        res.json(data);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});