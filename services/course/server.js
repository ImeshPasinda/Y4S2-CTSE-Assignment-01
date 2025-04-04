const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 8070;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


// MongoDB connection
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connection successful!');
});

// Health check route
app.get("/", (req, res) => {
  res.send("Course service is working!");
});

// Routes
const courseRoutes=require('./routes/courseRoutes');
app.use('/api/course',courseRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
