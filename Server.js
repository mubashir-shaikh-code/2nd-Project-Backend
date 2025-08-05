const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const MONGO_URI = 'mongodb+srv://mubashiraijaz1:1234@cluster0.4jnkxno.mongodb.net/liflow';

// ✅ Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://2nd-project-sigma.vercel.app"],
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));


// ✅ Routes
app.use('/api/auth', require('./Routes/Auth'));


const productRoutes = require('./Routes/Product');
app.use('/api/products', productRoutes);

const orderRoutes = require('./Routes/OrderRoutes');
app.use('/api/orders', orderRoutes);


// ✅ Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });

// ✅ 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
