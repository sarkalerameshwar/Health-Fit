// routes/uploadPaymentProof.route.js
import express from 'express';
import multer from 'multer';
import { uploadPaymentProof } from '../controllers/uploadPaymentProof.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Use memory storage so file stays in buffer (no local storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/orders/upload-payment-proof
// Field name for file: paymentScreenshot
router.post(
  '/upload-payment-proof',
  protect,
  upload.single('paymentScreenshot'), // key must match frontend
  uploadPaymentProof
);

export default router;
