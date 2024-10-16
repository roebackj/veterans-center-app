const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const fileRoutes = require('./routes/fileRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const port = 3000; // Use a fixed port number

// Enable CORS for React
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
const connectDB = require('./database'); // Updated to use database.js
connectDB();

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/data', dataRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});