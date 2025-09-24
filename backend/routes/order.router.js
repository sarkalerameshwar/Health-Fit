import express from 'express';
import {protect} from '../middlewares/auth.middleware.js'; 
import admin from '../middlewares/admin.middleware.js';

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserId,
  checkSubscriptionStatus
} from '../controllers/order.controller.js';

const router = express.Router();

// Create a new order with validation
router.post('/create', protect, createOrder);

// Get all orders with optional filtering
router.get('/', admin, getOrders);

// Get orders by user ID
router.get('/:userId', getOrdersByUserId);

// Get current user's latest order/subscription
router.get('/user', protect, checkSubscriptionStatus);

// Get single order by ID
router.get('/:id', admin, getOrderById);

// Update order status
router.put('/:id/status', admin, updateOrderStatus);

export default router;
