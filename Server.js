const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Use dynamic PORT for Railway or fallback to local
const PORT = process.env.PORT || 5000;

// ✅ Mongo URI (You can keep it like this if you're not using env vars)
const MONGO_URI = 'mongodb+srv://mubashiraijaz1:1234@cluster0.4jnkxno.mongodb.net/liflow';

// ✅ Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://2nd-project-sigma.vercel.app"
  ],
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));

// ✅ Routes
app.use('/api/auth', require('./Routes/Auth'));      
app.use('/api/products', require('./Routes/Product')); 

// ✅ Connect to MongoDB and then start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
