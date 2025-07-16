const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// ✅ Config
const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/LiFlow';

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ✅ Routes
app.use('/api/auth', require('./Routes/Auth'));      // ✅ no colon here
app.use('/api/products', require('./Routes/Product')); // ✅ no colon here

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
