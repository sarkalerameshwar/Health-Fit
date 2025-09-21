// subscription.controller.js
import sendEmail from '../utils/email.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';

const confirmSubscription = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate input
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find the order (without updating it)
    const order = await Order.findById(orderId).populate('userId', 'username email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get user details
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate exact 1-month expiry date from today
    const startDate = new Date();
    const endDate = new Date();
    
    // Add exactly 1 month to the current date
    endDate.setMonth(endDate.getMonth() + 1);
    
    // If the calculated date doesn't exist in the next month (e.g., Jan 31 + 1 month = Feb 28/29),
    // adjust to the last day of the next month
    if (endDate.getDate() !== startDate.getDate()) {
      endDate.setDate(0); // Set to last day of previous month
    }

    // Format dates
    const formattedStartDate = startDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const formattedEndDate = endDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Calculate days remaining
    const daysRemaining = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Prepare email content
    const emailSubject = `HealthFit - ${order.plan} Subscription Confirmed`;
    
    const emailContent = `
HEALTHFIT - SUBSCRIPTION CONFIRMED

Hello ${user.username}!

Your HealthFit subscription has been successfully confirmed. 

📅 ORDER & SUBSCRIPTION DETAILS:
Order ID: ${order._id}
Plan: ${order.plan}
Amount: ₹${order.planDetails?.price || 'N/A'}
Subscription Start: ${formattedStartDate}
Subscription End: ${formattedEndDate}
Duration: ${daysRemaining} days (1 month)
Payment Method: ${order.paymentMethod}
Status: ${order.status}

🎯 YOUR SUBSCRIPTION INCLUDES:
• Unlimited access to all workout programs
• Personalized nutrition plans
• 24/7 expert trainer support
• Progress tracking dashboard
• Customized fitness recommendations

📍 DELIVERY INFORMATION:
Name: ${order.name}
Address: ${order.address}
Mobile: ${order.mobileNumber}
${order.alternetNumber ? `Alternate Mobile: ${order.alternetNumber}` : ''}

Your subscription is active from ${formattedStartDate} to ${formattedEndDate}.
You will have full access to all features during this period.

If you have any questions, feel free to contact our support team.

Stay healthy and keep fit!
The HealthFit Team

---
© ${new Date().getFullYear()} HealthFit. All rights reserved.
This is an automated message, please do not reply to this email.`;

    // Send confirmation email
    await sendEmail(
      user.email,
      emailSubject,
      emailContent
    );

    res.status(200).json({
      success: true,
      message: 'Subscription confirmation email sent successfully',
      data: {
        orderId: order._id,
        plan: order.plan,
        amount: order.planDetails?.price,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        daysRemaining: daysRemaining,
        status: order.status,
        emailSentTo: user.email
      }
    });

  } catch (error) {
    console.error('Subscription confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send subscription confirmation email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Alternative function to calculate exact 1-month expiry
export const calculateOneMonthExpiry = (startDate = new Date()) => {
  const endDate = new Date(startDate);
  
  // Add exactly 1 month
  endDate.setMonth(endDate.getMonth() + 1);
  
  // Handle edge cases where the next month doesn't have the same day
  // (e.g., January 31 → February 28/29)
  if (endDate.getDate() !== startDate.getDate()) {
    endDate.setDate(0); // Set to last day of previous month
  }
  
  return endDate;
};

export { confirmSubscription };