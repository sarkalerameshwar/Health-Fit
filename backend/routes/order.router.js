// routes/order.routes.js
import express from 'express';
import {protect} from '../middlewares/auth.middleware.js'; // your auth middleware

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserId
} from '../controllers/order.controller.js';

const router = express.Router();

// Create a new order with validation
router.post('/create', protect, createOrder);

// Get all orders with optional filtering
router.get('/', getOrders);

// Get orders by user ID
router.get('/user/:userId', getOrdersByUserId);

// Get single order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id', updateOrderStatus);

export default router;
