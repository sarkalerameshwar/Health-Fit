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

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());

app.use(cors());


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use('/api/inquiry', inquiryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})