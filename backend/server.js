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

app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:5173' || 'http://localhost:5174', // your frontend origin
  credentials: true,              // allow cookies/auth
};

app.use(cors(corsOptions));


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.use('/api/payments', upload);

// admin routes
app.use('/api/admin',adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})