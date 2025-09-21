// routes/subscriptionRoutes.js
import express from 'express';
import { confirmSubscription } from '../controllers/subscription.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/subscriptions/confirm
router.post('/confirm/:orderId',protect, confirmSubscription);

export default router;