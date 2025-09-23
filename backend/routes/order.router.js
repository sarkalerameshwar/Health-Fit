import express from 'express';
import {protect} from '../middlewares/auth.middleware.js'; 
import admin from '../middlewares/admin.middleware.js';

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
router.get('/', admin, getOrders);

// Get orders by user ID
router.get('/user/:userId', getOrdersByUserId);

// Get single order by ID
router.get('/:id', admin, getOrderById);

// Update order status
router.put('/:id/status', admin, updateOrderStatus);

export default router;
