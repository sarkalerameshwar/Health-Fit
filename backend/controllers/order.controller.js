// controllers/orderController.js
import Order from "../models/order.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

// Create a new order
export const createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    console.log("Creating order for user:", userId);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

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
      console.error("Missing required fields:", {
        plan,
        address,
        confirmAddress,
        mobileNumber,
        paymentMethod,
        planDetails,
      });
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate addresses match
    if (address !== confirmAddress) {
      console.error("Address mismatch:", { address, confirmAddress });
      return res.status(400).json({
        success: false,
        message: "Address and confirmation address do not match",
      });
    }

    // Get user details from database
    console.log("Fetching user from database...");
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found:", user.email);

    // **IMPROVED: Check for ANY existing order (not just active subscriptions)**
    console.log("Checking for existing orders...");
    
    // Check for any order that's not cancelled or failed
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
    }).sort({ createdAt: -1 }); // Get the most recent order

    if (existingOrder) {
      console.log("Existing order found:", existingOrder._id);
      console.log("Existing order status:", existingOrder.status);
      
      const currentDate = new Date();
      let message = "";
      let additionalData = {};

      // Handle different order statuses
      switch (existingOrder.status) {
        case "pending":
        case "awaiting_payment_proof":
        case "pending_verification":
          message = "You already have a pending order. Please complete the payment or wait for verification.";
          additionalData = {
            existingOrderId: existingOrder._id,
            currentStatus: existingOrder.status,
            suggestion: "Please check your order status or contact support if you need assistance."
          };
          break;

        case "confirmed":
        case "active":
          // Check if subscription is still valid
          if (existingOrder.subscriptionEnd && existingOrder.subscriptionEnd > currentDate) {
            const daysRemaining = Math.ceil(
              (existingOrder.subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)
            );

            const formattedExpiryDate = existingOrder.subscriptionEnd.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            message = "You already have an active subscription";
            additionalData = {
              existingOrderId: existingOrder._id,
              currentPlan: existingOrder.plan,
              expiresOn: formattedExpiryDate,
              daysRemaining: daysRemaining,
              status: existingOrder.status,
              suggestion: "You can renew your subscription when it expires or contact support for upgrade options."
            };
          } else {
            // Subscription ended but order status wasn't updated
            message = "You have a previous order that needs status update";
            additionalData = {
              existingOrderId: existingOrder._id,
              currentStatus: existingOrder.status,
              suggestion: "Please contact support to resolve this issue."
            };
          }
          break;

        case "processing":
          message = "Your order is currently being processed";
          additionalData = {
            existingOrderId: existingOrder._id,
            currentStatus: existingOrder.status,
            suggestion: "Please wait for processing to complete or contact support."
          };
          break;

        default:
          message = "You already have an existing order";
          additionalData = {
            existingOrderId: existingOrder._id,
            currentStatus: existingOrder.status,
            suggestion: "Please check your order status before creating a new one."
          };
      }

      return res.status(400).json({
        success: false,
        message: message,
        data: additionalData
      });
    }

    // **NEW: Also check for recently cancelled or expired orders that can be renewed**
    console.log("Checking for expired or cancelled orders that can be renewed...");
    const recentOrder = await Order.findOne({
      userId,
      status: { $in: ["expired", "cancelled"] }
    }).sort({ createdAt: -1 });

    // Calculate subscription dates
    let subscriptionStart = new Date();
    let subscriptionEnd = new Date();

    // Default to 1 month
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    // If user has a recent expired/cancelled order, use appropriate start date
    if (recentOrder) {
      console.log("Recent order found for renewal:", recentOrder._id);
      
      // For expired orders, start from expiry date to avoid gaps
      if (recentOrder.status === "expired" && recentOrder.subscriptionEnd) {
        subscriptionStart = new Date(recentOrder.subscriptionEnd);
        
        // Prevent backdating if expired long ago
        if (subscriptionStart < currentDate) {
          subscriptionStart = currentDate;
        }
        
        subscriptionEnd = new Date(subscriptionStart);
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      }
      // For cancelled orders, start from current date
    }

    console.log("Creating new order...");
    // Create new order with user details from database
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
      subscriptionStart,
      subscriptionEnd,
      status: paymentMethod === "Cash On Delivery" ? "confirmed" : "pending",
    });

    // Save order to database
    console.log("Saving order to database...");
    const savedOrder = await newOrder.save();
    console.log("Order saved successfully:", savedOrder._id);

    // If UPI payment, set status to pending verification
    if (paymentMethod === "Online") { // Changed from "upi" to "Online" to match frontend
      savedOrder.status = "pending_verification";
      await savedOrder.save();

      return res.status(201).json({
        success: true,
        message: "Order created successfully. Please upload your payment proof for verification.",
        order: savedOrder,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
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
      status: { $in: ["confirmed", "active"] },
      subscriptionEnd: { $gt: currentDate },
    });

    // Find most recent expired subscription
    const expiredSubscription = await Order.findOne({
      userId,
      status: "expired",
      subscriptionEnd: { $lt: currentDate },
    }).sort({ subscriptionEnd: -1 });

    // Find pending orders
    const pendingOrders = await Order.find({
      userId,
      status: "pending",
    });

    const canCreateNewOrder = !activeSubscription;

    res.status(200).json({
      success: true,
      data: {
        canCreateNewOrder,
        activeSubscription: activeSubscription
          ? {
              _id: activeSubscription._id,
              plan: activeSubscription.plan,
              status: activeSubscription.status,
              subscriptionEnd: activeSubscription.subscriptionEnd,
              daysRemaining: Math.ceil(
                (activeSubscription.subscriptionEnd - currentDate) /
                  (1000 * 60 * 60 * 24)
              ),
            }
          : null,
        expiredSubscription: expiredSubscription
          ? {
              _id: expiredSubscription._id,
              plan: expiredSubscription.plan,
              expiredOn: expiredSubscription.subscriptionEnd,
            }
          : null,
        pendingOrders: pendingOrders.map((order) => ({
          _id: order._id,
          plan: order.plan,
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



// Get all orders with optional filters and pagination
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

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id).populate("userId", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Error fetching order", error: error.message });
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

