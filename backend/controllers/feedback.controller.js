import Feedback from "../models/feedback.model.js";

// Add Feedback (All data from frontend)
export const addFeedback = async (req, res) => {
  try {
    const { userId, username, email, category, message, rating } = req.body;

    // Validation
    if (!userId || !username || !email || !category || !message || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const feedback = new Feedback({
      userId,
      username,
      email,
      category,
      message,
      rating: parseInt(rating) // Ensure it's a number
    });

    await feedback.save();

    res.status(201).json({ 
      message: "Feedback submitted successfully!", 
      feedback 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message 
    });
  }
};

// Get All Feedback (Admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: feedbackList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message
    });
  }
};

export default { addFeedback, getAllFeedback };
