import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to your User model
    required: true
    },
    username: {
    type: String,
    required: true
    },
    email: {
    type: String,
    required: true
    },
    category: {
    type: String,
    enum: ["General Inquiry ", "Technical", "Subscription Support", "Delivey Issues", "Billing Questions", "Product Information"],
    default: "General Inquiry"
    },
    subject: {
    type: String,
    required: true
    },
    message: {
    type: String,
    },
    createdAt: {
    type: Date,
    default: Date.now
    }

});

export default mongoose.model("Inquiry", inquirySchema);