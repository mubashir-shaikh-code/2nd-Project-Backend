const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// ✅ Config
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://mubashiraijaz1:1234@cluster0.4jnkxno.mongodb.net/liflow';

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Middlewares
app.use(cors({
  origin: 'https://2nd-project-sigma.vercel.app', // ✅ Your frontend deployed URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));

// ✅ Routes
app.use('/api/auth', require('./Routes/Auth'));      
app.use('/api/products', require('./Routes/Product')); 

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
