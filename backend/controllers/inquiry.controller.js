import Inquiry from "../models/inquiry.model.js";

// Add Inquiry (User sends message + optional rating)
export const addInquiry = async (req, res) => {
  try {
    const { _id: userId, username, email } = req.user;
    const { subject, message, rating } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Inquiry message is required" });
    }

    const inquiry = new Inquiry({ userId, username , email, subject, message });
    await inquiry.save();

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully!",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Get All Inquiries (Admin)
export const getAllInquiry = async (req, res) => {
  try {
    const inquiryList = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiryList.length,
      inquiries: inquiryList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
};

// Get Inquiries by Logged-in User
export const getMyInquiry = async (req, res) => {
  try {
    const myInquiries = await Inquiry.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: myInquiries.length,
      inquiries: myInquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your inquiries",
      error: error.message,
    });
  }
};

// Update Inquiry Status
export const updateInquiryStatus = async (inquiryId, newStatus) => {
  try {
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return { success: false, error: "Inquiry not found" };
    }
    inquiry.status = newStatus;
    await inquiry.save();
    return { success: true, inquiry };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
