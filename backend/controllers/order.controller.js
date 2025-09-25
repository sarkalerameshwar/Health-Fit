// controllers/orderController.js
import Order from "../models/order.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import cron from "node-cron";

// Utility function to calculate exact 30-day subscription
const calculateSubscriptionDates = (startDate = new Date()) => {
  const subscriptionStart = new Date(startDate);
  const subscriptionEnd = new Date(subscriptionStart);
  
  // Add exactly 30 days (not 1 month)
  subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);
  
  return { subscriptionStart, subscriptionEnd };
};

// Create a new order with proper 30-day expiry
export const createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const {
      plan,
      address,
      confirmAddress,
      city,
      mobileNumber,
      alternetNumber,
      paymentMethod,
      planDetails,
    } = req.body;

    // Validate required fields
    if (
      !plan ||
      !address ||
      !confirmAddress ||
      !mobileNumber ||
      !paymentMethod ||
      !planDetails
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate addresses match
    if (address !== confirmAddress) {
      return res.status(400).json({
        success: false,
        message: "Address and confirmation address do not match",
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check for existing active/pending orders
    const existingOrder = await Order.findOne({
      userId,
      status: { 
        $in: [
          "pending", 
          "confirmed", 
          "active", 
          "processing", 
          "awaiting_payment_proof",
          "pending_verification"
        ] 
      }
    }).sort({ createdAt: -1 });

    if (existingOrder) {
      const currentDate = new Date();
      let message = "";
      let additionalData = {};

      switch (existingOrder.status) {
        case "pending":
        case "awaiting_payment_proof":
        case "pending_verification":
          message = "You already have a pending order. Please complete the payment or wait for verification.";
          additionalData = {
            existingOrderId: existingOrder._id,
            currentStatus: existingOrder.status,
          };
          break;

        case "confirmed":
        case "active":
          if (existingOrder.subscriptionEnd && existingOrder.subscriptionEnd > currentDate) {
            const daysRemaining = Math.ceil(
              (existingOrder.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)
            );

            message = "You already have an active subscription";
            additionalData = {
              existingOrderId: existingOrder._id,
              currentPlan: existingOrder.plan,
              expiresOn: existingOrder.subscriptionEnd.toLocaleDateString("en-IN"),
              daysRemaining: daysRemaining,
              status: existingOrder.status,
            };
          }
          break;

        default:
          message = "You already have an existing order";
          additionalData = {
            existingOrderId: existingOrder._id,
            currentStatus: existingOrder.status,
          };
      }

      if (message) {
        return res.status(400).json({
          success: false,
          message: message,
          data: additionalData
        });
      }
    }

    // Calculate subscription dates - exactly 30 days from now
    const { subscriptionStart, subscriptionEnd } = calculateSubscriptionDates();

    // For renewal cases - check for expired orders
    const recentExpiredOrder = await Order.findOne({
      userId,
      status: "expired"
    }).sort({ subscriptionEnd: -1 });

    // If renewing an expired subscription, start from expiry date
    let finalSubscriptionStart = subscriptionStart;
    if (recentExpiredOrder && recentExpiredOrder.subscriptionEnd) {
      // Start from the expiry date of the previous subscription
      finalSubscriptionStart = new Date(recentExpiredOrder.subscriptionEnd);
      const { subscriptionEnd: newEnd } = calculateSubscriptionDates(finalSubscriptionStart);
      finalSubscriptionStart = finalSubscriptionStart;
      subscriptionEnd = newEnd;
    }

    // Create new order
    const newOrder = new Order({
      userId,
      name: user.name || user.username,
      email: user.email,
      plan,
      address,
      confirmAddress,
      city,
      mobileNumber,
      alternetNumber: alternetNumber || null,
      paymentMethod,
      planDetails,
      subscriptionStart: finalSubscriptionStart,
      subscriptionEnd,
      status: paymentMethod === "Cash On Delivery" ? "confirmed" : "pending",
    });

    const savedOrder = await newOrder.save();
    // console.log("Order created with 30-day subscription:", savedOrder._id);

    // Handle payment method specific status
    if (paymentMethod === "Online") {
      savedOrder.status = "pending_verification";
      await savedOrder.save();

      return res.status(201).json({
        success: true,
        message: "Order created successfully. Please upload payment proof.",
        order: savedOrder,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    // console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Automatic expiry check function (to be called by cron job)
export const checkAndUpdateExpiredSubscriptions = async () => {
  try {
    const currentDate = new Date();
    // console.log(`[${currentDate.toISOString()}] Checking for expired subscriptions...`);

    // Find orders that should be expired
    const ordersToExpire = await Order.find({
      status: { $in: ["confirmed", "active"] },
      subscriptionEnd: { $lte: currentDate },
      isExpired: false
    });

    // console.log(`Found ${ordersToExpire.length} orders to expire`);

    if (ordersToExpire.length > 0) {
      const updateResult = await Order.updateMany(
        {
          _id: { $in: ordersToExpire.map(order => order._id) }
        },
        {
          $set: {
            status: "expired",
            isExpired: true,
            lastStatusCheck: currentDate
          }
        }
      );

      // console.log(`Successfully expired ${updateResult.modifiedCount} orders`);
      
      // Log the expired orders
      // ordersToExpire.forEach(order => {
      //   console.log(`Order ${order._id} expired. Was valid until: ${order.subscriptionEnd}`);
      // });
    }

    return {
      success: true,
      expiredCount: ordersToExpire.length,
      message: `Expired ${ordersToExpire.length} subscriptions`
    };
  } catch (error) {
    console.error("Error in expiry check:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Manual expiry check endpoint (for testing and manual triggers)
// Enhanced manual expiry check with better response
export const manualExpiryCheck = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log(`Manual expiry check triggered at: ${currentDate.toISOString()}`);
    
    // Find orders that should be expired
    const ordersToExpire = await Order.find({
      status: { $in: ["confirmed", "active"] },
      subscriptionEnd: { $lte: currentDate },
      isExpired: false
    }).populate("userId", "name email");

    console.log(`Found ${ordersToExpire.length} orders to expire`);

    let expiredOrders = [];
    
    if (ordersToExpire.length > 0) {
      // Update each order individually to track which ones were expired
      for (const order of ordersToExpire) {
        const updatedOrder = await Order.findByIdAndUpdate(
          order._id,
          {
            $set: {
              status: "expired",
              isExpired: true,
              lastStatusCheck: currentDate
            }
          },
          { new: true }
        ).populate("userId", "name email");

        expiredOrders.push({
          orderId: updatedOrder._id,
          userId: updatedOrder.userId._id,
          userName: updatedOrder.userId.name,
          plan: updatedOrder.plan,
          subscriptionEnd: updatedOrder.subscriptionEnd,
          expiredAt: currentDate
        });

        console.log(`Expired order ${order._id} for user ${updatedOrder.userId.name}`);
      }

      return res.status(200).json({
        success: true,
        message: `Successfully expired ${expiredOrders.length} order(s)`,
        data: {
          expiredCount: expiredOrders.length,
          expiredOrders: expiredOrders,
          checkTime: currentDate,
          summary: {
            totalChecked: ordersToExpire.length,
            expired: expiredOrders.length,
            noActionNeeded: 0
          }
        }
      });
    } else {
      // No orders to expire
      const activeOrdersCount = await Order.countDocuments({
        status: { $in: ["confirmed", "active"] },
        subscriptionEnd: { $gt: currentDate }
      });

      const alreadyExpiredCount = await Order.countDocuments({
        status: "expired",
        isExpired: true
      });

      return res.status(200).json({
        success: true,
        message: "No orders need to be expired at this time",
        data: {
          expiredCount: 0,
          expiredOrders: [],
          checkTime: currentDate,
          summary: {
            totalActiveSubscriptions: activeOrdersCount,
            alreadyExpired: alreadyExpiredCount,
            needingExpiry: 0,
            noActionNeeded: activeOrdersCount + alreadyExpiredCount
          },
          status: "All subscriptions are up-to-date"
        }
      });
    }
  } catch (error) {
    console.error("Error in manual expiry check:", error);
    res.status(500).json({
      success: false,
      message: "Error performing expiry check",
      error: error.message,
      details: "Check server logs for more information"
    });
  }
};

// Enhanced subscription status check
export const checkSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();

    // First, check and update any expired subscriptions for this user
    const userExpiredOrders = await Order.find({
      userId,
      status: { $in: ["confirmed", "active"] },
      subscriptionEnd: { $lte: currentDate },
      isExpired: false
    });

    if (userExpiredOrders.length > 0) {
      await Order.updateMany(
        { _id: { $in: userExpiredOrders.map(order => order._id) } },
        { 
          $set: { 
            status: "expired", 
            isExpired: true,
            lastStatusCheck: currentDate
          } 
        }
      );
    }

    // Now get the current status
    const activeSubscription = await Order.findOne({
      userId,
      status: { $in: ["confirmed", "active"] },
      subscriptionEnd: { $gt: currentDate },
    });

    const expiredSubscription = await Order.findOne({
      userId,
      status: "expired",
    }).sort({ subscriptionEnd: -1 });

    const pendingOrders = await Order.find({
      userId,
      status: { $in: ["pending", "pending_verification"] },
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
          subscriptionStart: activeSubscription.subscriptionStart,
          subscriptionEnd: activeSubscription.subscriptionEnd,
          daysRemaining: Math.ceil(
            (activeSubscription.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)
          ),
          totalDuration: 30,
          daysUsed: 30 - Math.ceil(
            (activeSubscription.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)
          )
        } : null,
        expiredSubscription: expiredSubscription ? {
          _id: expiredSubscription._id,
          plan: expiredSubscription.plan,
          expiredOn: expiredSubscription.subscriptionEnd,
          canRenew: true
        } : null,
        pendingOrders: pendingOrders.map((order) => ({
          _id: order._id,
          plan: order.plan,
          status: order.status,
          createdAt: order.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking subscription status",
    });
  }
};

// Get order with expiry information
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id).populate("userId", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const currentDate = new Date();
    const isExpired = order.subscriptionEnd <= currentDate;
    
    // Auto-update status if expired
    if (isExpired && !order.isExpired && order.status !== "expired") {
      order.status = "expired";
      order.isExpired = true;
      order.lastStatusCheck = currentDate;
      await order.save();
    }

    const orderWithExpiryInfo = {
      ...order.toObject(),
      isCurrentlyExpired: isExpired,
      daysRemaining: isExpired ? 0 : Math.ceil(
        (order.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)
      ),
      totalDuration: 30
    };

    res.status(200).json({ success: true, data: orderWithExpiryInfo });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
  }
};

// ... keep your existing getOrders, updateOrderStatus, getOrdersByUserId functions

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.userId = userId;

    const orders = await Order.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid order ID" });

    const allowedStatuses = ["pending", "pending_verification", "confirmed"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status value" });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Error updating order", error: error.message });
  }
};

// Get orders by user ID (with optional status and pagination)
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: "Invalid user ID" });

    const filter = { userId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching user orders", error: error.message });
  }
};

