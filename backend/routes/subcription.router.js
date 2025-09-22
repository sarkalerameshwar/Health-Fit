// routes/subscriptionRoutes.js
import express from 'express';
import { confirmSubscription, getAllSubscriptions } from '../controllers/subscription.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import {verifyPayment} from '../controllers/uploadPaymentProof.controller.js';

const router = express.Router();

// POST /api/subscriptions/confirm
router.post('/confirm/:orderId',protect,verifyPayment, confirmSubscription);
router.get('/',getAllSubscriptions);

export default router;