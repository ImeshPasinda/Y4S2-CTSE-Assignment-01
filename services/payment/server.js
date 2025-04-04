const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 8050;

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
  res.send("Payment service is working!");
});

//Routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
