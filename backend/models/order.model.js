// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    planDetails: {
      price: Number,
      billingCycle: {
        type: String,
        default: "monthly",
      },
      features: [String],
    },
    subscriptionStart: {
      type: Date,
      default: Date.now,
      required: true,
    },
    subscriptionEnd: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    confirmAddress: {
      type: String,
      required: [true, "Confirm Address is required"],
    },
    city: { 
      type: String,
      required: [true, "City is required"],
      default: "Nanded"
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    alternetNumber: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash On Delivery", "Online"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "failed",
        "active",
        "cancelled",
        "expired",
        "pending_verification",
      ],
      default: "pending",
    },
    paymentScreenshot: {
      type: String, // store Cloudinary URL of uploaded screenshot
      default: null,
    },
    utrNumber: {
      type: String,
      default: null,
    },
    paymentVerified: {
      type: Boolean,
      default: false, // admin will mark true after verification
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field before saving
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
