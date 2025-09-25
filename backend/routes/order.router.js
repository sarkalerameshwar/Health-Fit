import express from 'express';
import {protect} from '../middlewares/auth.middleware.js'; 
import admin from '../middlewares/admin.middleware.js';

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserId,
  checkSubscriptionStatus,
  manualExpiryCheck 
} from '../controllers/order.controller.js';

const router = express.Router();

// Create a new order with validation
router.post('/create', protect, createOrder);

// Get all orders with optional filtering
router.get('/', admin, getOrders);

// expiry check
router.get("/expiry-check", protect, admin, manualExpiryCheck);

// Get orders by user ID
router.get('/users/:userId', getOrdersByUserId);

// Get single order by ID
router.get('/:id', getOrderById);

// Update order status
router.put('/:id/status', admin, updateOrderStatus);

export default router;
