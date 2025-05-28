import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import accountRoutes from './routes/accountRoutes.js';
// import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import momoRoutes from './routes/momoRoutes.js';
const app = express();
app.use(cors());
app.use(express.json());

app.use('/', accountRoutes);
// app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', momoRoutes);

const uri = process.env.MONGODB_URI;
console.log('MongoDB URI:', uri);

mongoose.connect(uri, {  
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection failed:', err);
});
