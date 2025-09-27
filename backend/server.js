// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/user.router.js';
import orderRoutes from './routes/order.router.js';
import subscriptionRoutes from './routes/subcription.router.js';
import feedbackRoutes from './routes/feedback.router.js';
import inquiryRoutes from './routes/inquiry.router.js';
import upload from './routes/upload.router.js';
import adminRoutes from './routes/admin.router.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS setup for multiple origins
const allowedOrigins = ['https://healthfit-sigma.vercel.app', 'https://health-fit-736g.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true, // allow cookies/auth headers
};

app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/payments', upload);
app.use('/api/admin', adminRoutes);

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.message === 'CORS not allowed from this origin') {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
