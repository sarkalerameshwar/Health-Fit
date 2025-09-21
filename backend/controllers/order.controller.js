// controllers/orderController.js
import Order from '../models/order.model.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

// Create a new order
export const createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const {
      plan,
      address,
      confirmAddress,
      mobileNumber,
      alternetNumber,
      paymentMethod,
      planDetails
    } = req.body;

    // Validate required fields
    if (!plan || !address || !confirmAddress || 
        !mobileNumber || !paymentMethod || !planDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate addresses match
    if (address !== confirmAddress) {
      return res.status(400).json({
        success: false,
        message: 'Address and confirmation address do not match'
      });
    }

    // Get user details from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Enhanced: Check if user has any active or non-expired subscription
    const currentDate = new Date();
    const activeSubscription = await Order.findOne({
      userId,
      status: { $in: ['confirmed', 'active'] },
      subscriptionEnd: { $gt: currentDate } // Subscription hasn't expired yet
    });

    if (activeSubscription) {
      // Calculate days remaining for better user feedback
      const daysRemaining = Math.ceil(
        (activeSubscription.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)
      );
      
      const formattedExpiryDate = activeSubscription.subscriptionEnd.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription',
        data: {
          existingOrderId: activeSubscription._id,
          currentPlan: activeSubscription.plan,
          expiresOn: formattedExpiryDate,
          daysRemaining: daysRemaining,
          status: activeSubscription.status,
          // Suggest renewal instead of new purchase
          suggestion: 'You can renew your subscription when it expires or contact support for upgrade options.'
        }
      });
    }

    // Check if user has an expired subscription that can be renewed
    const expiredOrder = await Order.findOne({
      userId,
      status: 'expired',
      subscriptionEnd: { $lt: currentDate } // Subscription has expired
    }).sort({ subscriptionEnd: -1 }); // Get the most recent expired order

    // Calculate subscription dates
    let subscriptionStart = new Date();
    let subscriptionEnd = new Date();
    
    // Default to 1 month
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    
    // If user has an expired subscription, continue from the expiry date
    // This ensures no gap between subscriptions
    if (expiredOrder) {
      subscriptionStart = new Date(expiredOrder.subscriptionEnd);
      
      // Prevent backdating if expired order ended long ago
      if (subscriptionStart < currentDate) {
        subscriptionStart = currentDate;
      }
      
      subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    }

    // Create new order with user details from database
    const newOrder = new Order({
      userId,
      name: user.name || user.username,
      email: user.email,
      plan,
      address,
      confirmAddress,
      mobileNumber,
      alternetNumber: alternetNumber || null,
      paymentMethod,
      planDetails,
      subscriptionStart,
      subscriptionEnd,
      status: paymentMethod === 'Cash On Delivery' ? 'confirmed' : 'pending'
    });

    // Save order to database
    const savedOrder = await newOrder.save();
    
    // If online payment, initiate payment gateway process
    if (paymentMethod === 'Online') {
      const paymentData = await initiatePaymentGateway(savedOrder);
      
      return res.status(201).json({
        success: true,
        message: 'Order created. Proceed with payment.',
        order: savedOrder,
        paymentData
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Additional helper function to check subscription status
export const checkSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();

    // Find active subscription
    const activeSubscription = await Order.findOne({
      userId,
      status: { $in: ['confirmed', 'active'] },
      subscriptionEnd: { $gt: currentDate }
    });

    // Find most recent expired subscription
    const expiredSubscription = await Order.findOne({
      userId,
      status: 'expired',
      subscriptionEnd: { $lt: currentDate }
    }).sort({ subscriptionEnd: -1 });

    // Find pending orders
    const pendingOrders = await Order.find({
      userId,
      status: 'pending'
    });

    const canCreateNewOrder = !activeSubscription;

    res.status(200).json({
      success: true,
      data: {
        canCreateNewOrder,
        activeSubscription: activeSubscription ? {
          _id: activeSubscription._id,
          plan: activeSubscription.plan,
          status: activeSubscription.status,
          subscriptionEnd: activeSubscription.subscriptionEnd,
          daysRemaining: Math.ceil((activeSubscription.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24))
        } : null,
        expiredSubscription: expiredSubscription ? {
          _id: expiredSubscription._id,
          plan: expiredSubscription.plan,
          expiredOn: expiredSubscription.subscriptionEnd
        } : null,
        pendingOrders: pendingOrders.map(order => ({
          _id: order._id,
          plan: order.plan,
          createdAt: order.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking subscription status'
    });
  }
};


// Get all orders
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };
    
    // Use pagination
    const orders = await Order.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email'); // Populate user details if needed
      
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }
    
    const order = await Order.findById(id).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, gatewayOrderId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'failed', 'active',  'expired'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const updateData = {};
    if (status) updateData.status = status;
    if (gatewayOrderId) updateData.gatewayOrderId = gatewayOrderId;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};


// Get orders by user ID
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    // Build filter object
    const filter = { userId };
    if (status) filter.status = status;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };
    
    const orders = await Order.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error: error.message
    });
  }
};

// Helper function for payment gateway integration (placeholder)
async function initiatePaymentGateway(order) {
  // Integration with payment gateway like Razorpay
  // This is a placeholder implementation
  return {
    orderId: `order_${Date.now()}`,
    amount: order.planDetails.price * 100, // in paise
    currency: 'INR',
    // Other payment gateway specific data
  };
}