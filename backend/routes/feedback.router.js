import express from "express";
import { addFeedback, getAllFeedback } from "../controllers/feedback.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; // your JWT auth middleware
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

// User adds feedback
router.post("/add", protect, addFeedback);

// Admin sees all feedback
router.get("/all",admin , getAllFeedback); // add admin middleware if needed

export default router;
