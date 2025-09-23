import cloudinary from 'cloudinary';
import Order from '../models/order.model.js';
import streamifier from 'streamifier';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadPaymentProof = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, utrNumber } = req.body;

    // Validate required fields
    if (!orderId || !utrNumber || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (orderId, utrNumber, or screenshot)'
      });
    }

    // Upload to Cloudinary from memory buffer
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: 'payment_proofs' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // ✅ FIX: only check orderId, then optionally check ownership
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Optional: ensure the logged-in user owns the order
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to upload proof for this order' });
    }

    // Update order with payment proof
    order.paymentScreenshot = result.secure_url;
    order.utrNumber = utrNumber;
    order.status = 'pending_verification';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      order
    });
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading payment proof',
      error: error.message
    });
  }
};


// admin function to verify payment

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    console.log('🔍 verifyPayment called with:');
    console.log('- orderId from params:', orderId);
    console.log('- req.params:', req.params);
    console.log('- req.body:', req.body);

    // ✅ Validate ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error('❌ Invalid orderId format:', orderId);
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        providedOrderId: orderId
      });
    }

    // ✅ Only check in Order collection
    console.log('🔍 Searching for order in database...');
    const order = await Order.findById(orderId);

    if (!order) {
      console.error('❌ Order not found in database:', orderId);
      console.log('🔍 Available orders in database:');

      // Debug: List recent orders to help identify the issue
      const recentOrders = await Order.find({}).limit(5).select('_id status createdAt');
      console.log('Recent orders:', recentOrders);

      return res.status(404).json({
        success: false,
        message: 'Order not found',
        providedOrderId: orderId,
        availableOrders: recentOrders.map(o => ({ id: o._id, status: o.status }))
      });
    }

    console.log('✅ Order found:', {
      id: order._id,
      status: order.status,
      userId: order.userId,
      paymentVerified: order.paymentVerified
    });

    // ✅ Mark payment verified (status update optional)
    order.paymentVerified = true;
    order.status = 'confirmed'; // you can remove this if you only want paymentVerified=true
    await order.save();

    console.log(`✅ Payment verified for Order ID: ${orderId}`);
    console.log(`📋 Order status updated to: ${order.status}`);
    console.log(`🔄 Proceeding to send confirmation email...`);

    // Attach order to req for next middleware
    req.order = order;

    // Hand over control to next middleware (e.g. confirmSubscription)
    next();

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};
