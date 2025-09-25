import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
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
    enum: ["Product Quality", "Delivery Service", "Customer Service", "Website Experience", "Pricing", "Other"],
    default: "Other"
  },
  message: {
    type: String,
    required: true
  },
  rating: {
    type: Number, // optional: allow 1-5 star rating
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Feedback", feedbackSchema);
