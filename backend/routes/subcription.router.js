// routes/subscriptionRoutes.js
import express from 'express';
import { confirmSubscription, getAllSubscriptions } from '../controllers/subscription.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import {verifyPayment} from '../controllers/uploadPaymentProof.controller.js';
import admin from '../middlewares/admin.middleware.js';

const router = express.Router();

// POST /api/subscriptions/confirm
router.post('/confirm/:orderId',admin,verifyPayment, confirmSubscription);
router.get('/', admin, getAllSubscriptions);

export default router;