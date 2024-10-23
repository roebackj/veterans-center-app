const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const fileRoutes = require('./routes/fileRoutes');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const chokidar = require('chokidar');
const { processPdfFile } = require('./utils/processPdfFile');

const app = express();
const port = 3000;

// Enable CORS for React
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
const connectDB = require('./database'); 
connectDB();

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);

// Temporary User Registration Route (For Testing Only)
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'User registration failed' });
    }
});

// Watch for new PDFs manually added to the "uploads" directory
const watcher = chokidar.watch(path.join(__dirname, 'uploads'), {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true
});

watcher.on('add', async (filePath) => {
    console.log(`File added: ${filePath}`);
    
    // Check if it's a PDF
    if (path.extname(filePath) !== '.pdf') return;

    try {
        // Process the new PDF file (ensure consistent handling)
        await processPdfFile(filePath);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
