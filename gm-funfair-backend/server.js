// backend/server.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: '*', // Replace '*' with specific origin(s) if needed, e.g., 'http://localhost:3000'
    methods: ['GET', 'POST'], // Specify allowed methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'] // Add any custom headers if necessary
}));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const User = require('./models/User');
const Merchant = require('./models/Merchant');
const Transaction = require('./models/Transaction');

// Sync all models
db.sync({ force: false }) // Set to true only if you want to drop and recreate tables
    .then(() => console.log('Database & tables created!'))
    .catch(error => console.log('This error occurred:', error));

