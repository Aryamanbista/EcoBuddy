// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));

// Default route
app.get('/', (req, res) => {
  res.send('EcoBuddy API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));