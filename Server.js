// Remove duplicate route mounting and add error handling
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://2nd-project-sigma.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./Routes/Auth'));
app.use('/api/products', require('./Routes/Product'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mubashiraijaz1:1234@cluster0.4jnkxno.mongodb.net/liflow')
  .then(() => {
    console.log('✅ MongoDB Connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });