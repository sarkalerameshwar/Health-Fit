import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";

// Add Feedback
export const addFeedback = async (req, res) => {
  try {
    const userId = req.user.id; // from your auth middleware (JWT)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { message, rating } = req.body;

    const feedback = new Feedback({
      userId,
      username: user.username,
      email: user.email,
      message,
      rating
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!", feedback });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get All Feedback (Admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

export default {addFeedback, getAllFeedback};