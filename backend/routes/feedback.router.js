import express from "express";
import { addFeedback, getAllFeedback } from "../controllers/feedback.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

// Add feedback (protected route)
router.post("/add", protect, addFeedback);

// Get all feedback (admin only)
router.get("/all", admin, getAllFeedback);

export default router;
