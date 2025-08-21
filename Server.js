const express = require('express');
// const mongoose = require('mongoose'); //Commenting out MongoDB
const cors = require('cors');
const db = require('./db'); // Import MySQL connection

const app = express();

// const MONGO_URI = 'mongodb+srv://mubashiraijaz1:1234@cluster0.4jnkxno.mongodb.net/liflow';

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));

// Routes
const orderRoutes = require('./Routes/OrderRoutes');
app.use('/api/orders', orderRoutes);

app.use('/api/auth', require('./Routes/Auth'));

const productRoutes = require('./Routes/Product');
app.use('/api/products', productRoutes);

// ✅ Connect to MySQL and start server
(async () => {
  try {
    await db.getConnection(); // test the connection
    console.log('MySQL Connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  } catch (err) {
    console.error('MySQL Connection Error:', err);
  }
})();

// 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
