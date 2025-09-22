import cloudinary from 'cloudinary';
import Order from '../models/order.model.js';
import streamifier from 'streamifier';
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

    // Find the order
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
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

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentVerified = true;
    order.status = 'confirmed';
    await order.save();

    req.order = order; // attach order to req for next middleware
    next(); // proceed to confirmSubscription

    res.status(200).json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};
